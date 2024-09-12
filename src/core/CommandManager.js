import { get } from "lodash-es";
import { dia, mvc, util } from '@joint/core';
import DiffMatchPatch from "diff-match-patch";
import * as jsondiffpatch from "jsondiffpatch";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

// Max number of commands in the undoStack
const STACK_LIMIT = 500;

export class CommandManager {
  constructor(options) {
    this.cm = new mvc.Model();
    this.graph = options.graph;
    this.logger = new Logger();
    this.runtime = new Runtime();

    this.differ = jsondiffpatch.create({
      arrays: {
        detectMove: true,
        includeValueOnMove: false,
      },
      textDiff: {
        diffMatchPatch: DiffMatchPatch,
        minLength: 100,
      },
      cloneDiffValues: true,
    });

    this.reset();
    this.listen();
  }

  listen() {
    this.cm.listenTo(this.graph, 'all', this.addCommand.bind(this));
    this.cm.listenTo(this.graph, 'batch:start', this.initBatchCommand.bind(this));
    this.cm.listenTo(this.graph, 'batch:stop', this.storeBatchCommand.bind(this));
    this.cm.listenTo(this.graph, 'reset', this.reset.bind(this));
  }

  on(event, fn) {
    this.cm.on(event, fn);
  }

  createCommand(options) {
    return {
      action: undefined,
      data: {
        id: undefined,
        type: undefined,
        diff: {},
      },
      batch: !!options?.batch,
    };
  }

  push(cmd) {
    this.redoStack = [];

    if(cmd.batch) {
      this._pushBatch(this.batchCommand, cmd);
      this.cm.trigger('batch', cmd);
    } else {
      this._push(this.undoStack, cmd);
      this.cm.trigger("stack:push");
    }
  }

  _pushBatch(stack, cmd) {
    if(!stack.length) {
      stack.push(cmd);
      return;
    }

    // Squash "change:position" commands of the same node
    const prevCmd = stack.find(c => c.data.id === cmd.data.id);
    if(
      prevCmd !== undefined &&
      cmd.action === "change:position" &&
      prevCmd.action === "change:position" &&
      cmd.data.id === prevCmd.data.id
    ) {
      if("x" in cmd.data.diff.position) {
        prevCmd.data.diff.position.x ??= cmd.data.diff.position.x;
        prevCmd.data.diff.position.x[1] = cmd.data.diff.position.x[1];
      }

      if("y" in cmd.data.diff.position) {
        prevCmd.data.diff.position.y ??= cmd.data.diff.position.y;
        prevCmd.data.diff.position.y[1] = cmd.data.diff.position.y[1];
      }

      return;
    }

    stack.push(cmd);
  }

  _push(stack, cmd) {
    stack.push(cmd);
    if(stack.length > STACK_LIMIT) {
      stack.splice(0, stack.length - STACK_LIMIT);
    }
  }

  addCommand(cmdName, cell, _graph, options = {}) {
    // Do not account for changes in `dry` run.
    if (options.dry) return;

    if(!/^(?:add|remove|change:\w+)$/.test(cmdName)) return;

    // Do not store the op if the callee explicitly asked us not to save it
    if(options?.skip_undo_stack === true) return;

    // change:zoom - When the canvas is being zoomed in/out
    // change:x||y - When the scroller is being moved by the user
    if(["change:zoom", "change:x", "change:y"].includes(cmdName)) return;

    let command = undefined;
    const isGraphCommand = (cell instanceof dia.Graph);

    if (this.batchCommand) {
      command = this.createCommand({ batch: true });
    } else {
      command = this.createCommand({ batch: false });
    }

    if (cmdName === 'add' || cmdName === 'remove') {
      command.action = cmdName;
      command.data.id = cell.id;
      command.data.type = cell.attributes.type;

      const attrs = cell.toJSON();
      const isStickyNote = attrs.type.includes("generic.StickyNote");
      command.data.attributes = util.merge({}, {
        id: attrs.id,
        position: attrs.position,
        z: attrs.z,

        // Persist size only for sticky notes
        ...(isStickyNote && {size: attrs.size}),

        // Sticky notes don't have ports
        ...(!isStickyNote && {ports: attrs.ports}),
      })

      this.push(command);
      return;
    }

    const changedAttribute = cmdName.split("change:")[1];

    if (!command.batch || !command.action) {
      command.action = cmdName;
      if (isGraphCommand) {
        command.graphChange = true;
      } else {
        command.data.id = cell.id;
        command.data.type = cell.attributes.type;
      }
    }

    command.data.diff[changedAttribute] = this.differ.diff(
      structuredClone(cell.previous(changedAttribute)),
      structuredClone(cell.get(changedAttribute)),
    );

    this.push(command);
  }

  initBatchCommand() {
    if (!this.batchCommand) {
      this.batchCommand = [];
      this.batchLevel = 0;
    } else {
      this.batchLevel++;
    }
  }

  storeBatchCommand() {
    if (this.batchCommand && this.batchLevel <= 0) {
      if (this.batchCommand.length > 0) {
        this.redoStack = [];

        this._push(this.undoStack, this.batchCommand);
        this.cm.trigger("stack:push");
        this.cm.trigger('add', this.batchCommand);
      }

      this.batchCommand = null;
      this.batchLevel = null;
    } else if (this.batchCommand && this.batchLevel > 0) {
      this.batchLevel--;
    }
  }

  _createNodeAttrsFromPatch(cmd) {
    const shapes = this.runtime.get("objects.shapes");

    // Create the node with default attrs, then apply diff attrs
    const shapeCls = get(shapes, cmd.data.type);
    const node = new shapeCls();
    if(node.enforceSettingsStructure) {
      node.enforceSettingsStructure();
    }
    const attrs = util.merge(
      node.toJSON(),
      cmd.data.attributes,
    );
    node.remove();
    return attrs;
  }

  _patchNodeAttrs(model, cmd, patchDirection) {
    const attribute = cmd.action.split("change:")[1];
    const data = structuredClone(model.get(attribute));
    const diff = cmd.data.diff[attribute];

    let patch;
    if(patchDirection === "forward") {
      patch = this.differ.patch(data, diff);
    } else if(patchDirection === "backward") {
      patch = this.differ.unpatch(data, diff);
    }

    return [attribute, structuredClone(patch)];
  }

  revertCommand(command) {
    this.logger.debug("Reverting commands...");
    this.cm.stopListening();

    [].concat(command).reverse().forEach(cmd => {
      if(cmd.action === "add") {
        this.logger.debug(`\tundoing [${cmd.action}] -> ${cmd.data.type}`);
        const model = this.graph.getCell(cmd.data.id);
        if(model) {
          model.remove();
        }
      } else if(cmd.action === "remove") {
        this.logger.debug(`\tundoing [${cmd.action}] -> ${cmd.data.type}`);
        const attrs = this._createNodeAttrsFromPatch(cmd);
        this.graph.addCell(attrs);
      } else {
        this.logger.debug(`\tundoing [${cmd.action}] -> ${cmd.data.type}`);
        const model = cmd.graphChange ? this.graph : this.graph.getCell(cmd.data.id);
        const [attribute, patch] = this._patchNodeAttrs(model, cmd, "backward");
        model.set(attribute, patch);
      }
    });

    this.listen();
  }

  applyCommand(command) {
    this.logger.debug("Applying commands...");
    this.cm.stopListening();

    [].concat(command).forEach(cmd => {
      const model = cmd.graphChange ? this.graph : this.graph.getCell(cmd.data.id);

      if(cmd.action === "add") {
        this.logger.debug(`\t[${cmd.action}] -> ${cmd.data.type}`);
        const attrs = this._createNodeAttrsFromPatch(cmd);
        this.graph.addCell(attrs);
      } else if(cmd.action === "remove") {
        this.logger.debug(`\t[${cmd.action}] -> ${cmd.data.type}`);
        model.remove();
      } else {
        this.logger.debug(`\t[${cmd.action}] -> ${cmd.data.type}`);
        const [attribute, patch] = this._patchNodeAttrs(model, cmd, "forward");
        model.set(attribute, patch);
      }
    });

    this.listen();
  }

  undo() {
    const command = this.undoStack.pop();
    if(command) {
      this.revertCommand(command);
      this.redoStack.push(command);
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if(command) {
      this.applyCommand(command);
      this.undoStack.push(command);
    }
  }

  cancel() {
    const command = this.undoStack.pop()
    if(command) {
      this.revertCommand(command);
      this.redoStack = [];
    }
  }

  reset() {
    this.undoStack = [];
    this.redoStack = [];
  }

  hasUndo() {
    return this.undoStack.length > 0;
  }

  hasRedo() {
    return this.redoStack.length > 0;
  }

  toJSON() {
    return {
      undo: structuredClone(this.undoStack),
      redo: structuredClone(this.redoStack),
    };
  }

  fromJSON(json) {
    this.undoStack = structuredClone(json.undo);
    this.redoStack = structuredClone(json.redo);
  }
}
