import { util, dia } from "@joint/core";
import { Logger } from "@src/core/Logger";
import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";
import { Layout } from "@src/engine/Layout";
import { hexToHSL } from "@src/utils/colors";
import { EventBus } from "@src/core/EventBus";
import { clone } from "@src/utils/lang/clone";
import { GroupSettings } from "@src/components/settings/GroupSettings";

const DEFAULT_STATE = {
  warnings: 0,
  errors: 0,
  isValid: true,
};

export class Base extends dia.Element {
  defaults() {
    return util.merge({}, super.defaults, {
      type: "nebulant.components.implementations.group.Base",

      label: "New group",
      color: "#7986cb",
      text_color: "#ffffff",
      image: "",

      duplicable: true,
      removable: true,
      resizable: false,
      configurable: true,
      groupable: true,

      state: clone(DEFAULT_STATE),

      data: {
        id: "group",
        version: "1.0.0",
        provider: "executionControl",
      }
    });
  }

  constructor(attributes = {}, options = {}) {
    super(attributes, options);

    this.logger = new Logger();
    this.runtime = new Runtime();
    this.eventBus = new EventBus();

    const { width, height } = this.size();

    this.attr({
      label: {
        display: "block",
      },
      image: {
        display: "block",
        xlinkHref: "",
      },
      backdropblur: {
        html: "<div></div>",
        width: `${width}px`,
        height: `${height}px`,
      },
    });

    this.rename(this.prop("label"));
    this.setImage(this.prop("image"));
    this.colorize(hexToHSL(this.prop("color")));
    this.colorizeText(hexToHSL(this.prop("text_color")));

    this.settingsTemplate = GroupSettings;
  }

  bootstrap() {
    const runtime = new Runtime();
    const shapes = runtime.get("objects.shapes");

    // Create "Start" node and add default settings
    const start = new shapes.nebulant.rectangle.vertical.executionControl.Start();
    start.enforceSettingsStructure();
    start.addTo(this.graph);
    start.prop("data/settings/parameters/group_settings_enabled", true);

    start.prop("data/settings/info", "");
    start.setInfo("");

    // Create "End" node and add default settings
    const end = new shapes.nebulant.rectangle.vertical.executionControl.End();
    end.enforceSettingsStructure();
    end.addTo(this.graph);

    this.embed([start, end]);

    // Correctly position "start" and "end" nodes.
    const layout = new Layout(this);
    layout.moveNodeToGridSegment([0, 0], start);
    layout.moveNodeToGridSegment([0, 4], end);

    // Create and connect the following links:
    //
    // - from the "in" port of the group to the "start" node
    // - from the "end" node to the "ko" port of the group
    // - from the "end" node to the "ok" port of the group
    let link = new shapes.nebulant.link.Static();
    link.source(this, { port: this.getPortByGroup("in").id });
    link.target(start, { port: start.getPortByGroup("in").id });
    link.addTo(this.graph).reparent();

    link = new shapes.nebulant.link.Static();
    link.source(end, { port: end.getPortByGroup("out-ko").id });
    link.target(this, { port: this.getPortByGroup("out-ko").id });
    link.addTo(this.graph).reparent();

    link = new shapes.nebulant.link.Static();
    link.source(end, { port: end.getPortByGroup("out-ok").id });
    link.target(this, { port: this.getPortByGroup("out-ok").id });
    link.addTo(this.graph).reparent();
  }

  addToGroup(children) {
    children.forEach(child => {
      // If the node that we're adding to this group already belongs to another
      // group, we must first detach it from that group. We must manually do
      // this because of https://github.com/clientIO/joint/issues/1733
      const parent = child.getParentCell();
      if(parent) parent.removeFromGroup(child);
    });

    const childrenIds = children.map(child => child.id);

    // We can't embed the global "Start" or "End" nodes into groups, that's why
    // we have to get the IDs of both nodes and check if the "children" array
    // contains them. But there is a problem! The "graph.getStartNode()" and
    // "graph.getEndNode()" methods search for any cell whos type is
    // "executionControl.Start" or "executionControl.End" and doesn't have a
    // parent and assume that it's the main "Start" or "End" node. Unfortunately
    // we can't assume this in this particular situation, since we might be
    // adding cells from a group that was just imported from a file, which means
    // that they won't have a parent...
    //const start = this.graph.getStartNode();
    const start = this.graph.getElements().find(node => {
      if(childrenIds.includes(node.id)) return false;
      return node.prop("type").includes("executionControl.Start") && !node.parent();
    });
    const end = this.graph.getElements().find(node => {
      if(childrenIds.includes(node.id)) return false;
      return node.prop("type").includes("executionControl.End") && !node.parent();
    });
    const ids = [
      ...(start?.id ? [start.id] : []),
      ...(end?.id ? [end.id] : []),
    ];

    children = children.filter(child => !ids.includes(child.id));

    const toBeEmbeddedNodes = children.map(child => {
      if(child.isGroup()) {
        return [child, ...child.getEmbeddedCells({ deep: true })];
      } else {
        return child;
      }
    }).flat();
    const toBeEmbeddedNodesIds = toBeEmbeddedNodes.map(node => node.id);
    const toBeEmbeddedLinks = [];
    toBeEmbeddedNodes.forEach(child => {
      // Detach each node that got added to this group from nodes that won't get
      // added to this group.
      //
      // We do this by getting the IDs of all the nodes that will be added to
      // the group (recursively for group nodes) and then checking, for each
      // node, if any of it's connections are to nodes that are not in the array
      // of nodes that will get embedded.
      let links = this.graph.getConnectedLinks(child, { inbound: true });
      links.forEach(link => {
        const node = link.getSourceElement();
        if(node && !toBeEmbeddedNodesIds.includes(node.id)) {
          link.remove();
        } else {
          toBeEmbeddedLinks.push(link);
        }
      });

      links = this.graph.getConnectedLinks(child, { outbound: true });
      links.forEach(link => {
        const node = link.getTargetElement();
        if(node && !toBeEmbeddedNodesIds.includes(node.id)) {
          link.remove();
        } else {
          toBeEmbeddedLinks.push(link);
        }
      });
    });

    this.embed(children);

    toBeEmbeddedLinks.forEach(link => link.reparent());
  }

  addTools({ elementView, scale }) {
    let cellTools = [];
    const model = elementView.model;
    const engine = elementView.paper;

    if(engine.selection.collection.get(model)) {
      cellTools = cellTools.concat(model.prop("cellTools"));
    }

    // Get the message tools that are already present in the node
    // Honor user settings (show errors? show warnings?)
    const { errors, warnings } = model.prop("state");
    const { show_warnings, show_errors } = engine.gconfig.get("advanced");

    let sw = false;
    if(show_errors && Object.keys(errors).length) {
      sw = true;
      cellTools = cellTools.concat(model.prop("errorsTool"));
    }

    if(!sw && show_warnings && Object.keys(warnings).length) {
      cellTools = cellTools.concat(model.prop("warningsTool"));
    }

    if(cellTools.length > 0) {
      const toolsView = new dia.ToolsView({
        tools: cellTools.map(cls => new cls({ scale })),
      });
      elementView.addTools(toolsView);
    }
  }

  hasInfo() {
    return false;
  }

  removeFromGroup(children) {
    this.unembed(children);
  }

  // Give it the name of the group and it will give you the port of that group
  getPortByGroup(group) {
    return this.getPorts().find(port => port.group == group);
  }

  rename(text) {
    this.attr({
      label: { textWrap: { text } },
    });
  }

  setImage(img) {
    this.attr({
      image: { xlinkHref: img },
    });
  }

  colorize({ h, s, l } = {}) {
    const bgColor01 = `hsl(${h}, ${s}%, ${l}%, 0.1)`;
    const bgColor03 = `hsl(${h}, ${s}%, ${l}%, 0.3)`;
    const borderColor = `hsl(${h}, ${s}%, ${l}%, 0.6)`;

    this.attr({
      pathBody: { fill: bgColor03, stroke: borderColor },
      pathBodyStack1: { fill: bgColor01, stroke: borderColor },
      pathBodyStack2: { fill: bgColor01, stroke: borderColor },
    });
  }

  colorizeText({ h, s, l } = {}) {
    const color = `hsl(${h}, ${s}%, ${l}%, 1)`;

    this.attr({
      label: { fill: color },
    });
  }

  isGroup() {
    return true;
  }

  toggle() {
    const engine = this.runtime.get("objects.engine");
    engine.pushLayer(this);
  }

  // We want to override getEmbeddedCells and make it act like if there are no
  // embedded cells, otherwise "fitEmbeds" will do wrong assumptions about the
  // size of the BBox of the group.
  getEmbeddedCells(opt) {
    if(this.graph?.hasActiveBatch("fit-embeds")) {
      return [];
    } else {
      return dia.Element.prototype.getEmbeddedCells.call(this, opt);
    }
  }

  getStartNode() {
    const cells = this.getEmbeddedCells();
    return cells.find(c => c.prop("type").includes("executionControl.Start"));
  }

  getEndNode() {
    const cells = this.getEmbeddedCells();
    return cells.find(c => c.prop("type").includes("executionControl.End"));
  }

  // Check if this group (or any nested groups) contains the node_id
  contains(node_id, deep = true) {
    return this.getEmbeddedCells({
      deep,
    }).map(node => node.id).includes(node_id);
  }

  // Groups don't have migrators
  migrateData() {
    return {
      data: {},
      success: true,
    };
  }

  // Groups don't have settings
  enforceSettingsStructure() {}

  saveSettings(form, isValid) {
    if(!isValid) {
      this.logger.warn("Saving settings with validation errors.");
    }

    // Save values and dispatch update event
    const startNode = this.getStartNode();
    startNode.prop("data/settings", clone(form.values), {
      rewrite: true, // don't merge, instead overwrite everything
    });
  }

  resetValidations() {
    const start = this.getStartNode();
    return start.resetValidations();
  }

  async validateSettings() {
    const state = clone(DEFAULT_STATE);

    const startNode = this.getStartNode();

    const res = startNode.prop("state");
    state.warnings += Object.keys(res.warnings).length;
    state.errors += Object.keys(res.errors).length;

    this.graph.getConnectedElements(startNode, "children").forEach(node => {
      const res = node.prop("state");
      state.warnings += Object.keys(res.warnings).length;
      state.errors += Object.keys(res.errors).length;
    });

    state.isValid = (state.warnings + state.errors) === 0;

    this.prop("state", state, {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });

    return state;
  }

  toJSON() {
    const res = dia.Element.prototype.toJSON.call(this);

    // Remove fields that should not be serialized
    const saveOnly = [
      "data",
      "embeds",
      "id",
      "parent",
      "ports",
      "position",
      "type",
      "z",
    ];
    Object.keys(res).forEach(field => {
      if(!saveOnly.includes(field)) {
        delete res[field];
      }
    });

    return res;
  }

  static shadows() {
    // We could have shadows, but that kills the CPU / GPU
    const gconfig = new GConfig();
    return gconfig.get("ui.shadows");
  }
}
