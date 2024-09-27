import { toast } from "react-toastify";

import Url from "@src/utils/domurl";

import { Logger } from "@src/core/Logger";
import { GConfig } from "@src/core/GConfig";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { CrashHandler } from "@src/core/CrashHandler";

import { save } from "@src/controllers/handlers/save";
import { saveAs } from "@src/controllers/handlers/saveAs";
import { autosave } from "@src/controllers/handlers/autosave";
import { saveAsPNG } from "@src/controllers/handlers/saveAsPNG";
import { saveAsSVG } from "@src/controllers/handlers/saveAsSVG";

import { cut } from "@src/controllers/handlers/cut";
import { copy } from "@src/controllers/handlers/copy";
import { paste } from "@src/controllers/handlers/paste";

import { undo } from "@src/controllers/handlers/undo";
import { redo } from "@src/controllers/handlers/redo";

import { selectAll } from "@src/controllers/handlers/selectAll";
import { unselectAll } from "@src/controllers/handlers/unselectAll";

import { open } from "@src/controllers/handlers/open";
import { remove } from "@src/controllers/handlers/remove";
import { exportBlueprintAsFile } from "@src/controllers/handlers/export";
import { loadFile, importAsBlueprint } from "@src/controllers/handlers/import";

import { toggleInfo } from "@src/controllers/handlers/toggleInfo";

// import { Layout } from "@src/engine/Layout";

import {
  alignLeft,
  alignRight,
  alignTop,
  alignBottom,
  alignVCenter,
  alignHCenter,
} from "@src/controllers/handlers/align";

import { group } from "@src/controllers/handlers/group";
import { ungroup } from "@src/controllers/handlers/ungroup";

import { CliConnectorStates } from "@src/core/CliConnector";
import { onLoglineChunkClick } from "@src/controllers/handlers/onLoglineChunkClick";
import { generateBlueprint } from "@src/components/blueprintGenerators/generateBlueprint";

export class BlueprintActions {
  constructor() {
    if(!!BlueprintActions.instance) {
      return BlueprintActions.instance;
    }

    BlueprintActions.instance = this;

    this.logger = new Logger();
    this.gconfig = new GConfig();
    this.runtime = new Runtime();
    this.eventBus = new EventBus();

    this.engine = this.runtime.get("objects.engine");
    this.backendConnector = this.runtime.get("objects.backendConnector");
    this.accountConnector = this.runtime.get("objects.accountConnector");

    this.eventBus.subscribe("Login", (_msg, _data) => {
      this.accountConnector.login();
    });
    this.eventBus.subscribe("Logout", (_msg, _data) => {
      this.accountConnector.logout();
    });

    this.eventBus.subscribe("NewBlueprint", (_msg, _data) => {
      const url = new Url();
      url.path = "/";
      url.clearQuery();
      window.open(url, "_blank");
    });
    this.eventBus.subscribe("Save", (_msg, _data) => save());
    this.eventBus.subscribe("Autosave", (_msg, _data) => autosave());
    this.eventBus.subscribe("OpenBlueprint", (_msg, _data) => open());

    this.eventBus.subscribe("UndoAction", (_msg, _data) => undo());
    this.eventBus.subscribe("RedoAction", (_msg, _data) => redo());

    this.eventBus.subscribe("SelectAllElements", (_msg, _data) => selectAll());
    this.eventBus.subscribe("UnselectAllElements", (_msg, _data) => unselectAll());

    this.eventBus.subscribe("CutSelectedElements", (_msg, _data) => cut());
    this.eventBus.subscribe("CopySelectedElements", (_msg, _data) => copy());
    this.eventBus.subscribe("PasteSelectedElements", (_msg, _data) => paste());

    this.eventBus.subscribe("GroupSelectedElements", (_msg, _data) => group());
    this.eventBus.subscribe("UngroupSelectedElements", (_msg, _data) => ungroup());

    this.eventBus.subscribe("AlignSelectionTop", (_msg, _data) => alignTop());
    this.eventBus.subscribe("AlignSelectionBottom", (_msg, _data) => alignBottom());
    this.eventBus.subscribe("AlignSelectionLeft", (_msg, _data) => alignLeft());
    this.eventBus.subscribe("AlignSelectionRight", (_msg, _data) => alignRight());
    this.eventBus.subscribe("CenterSelectionVertically", (_msg, _data) => alignVCenter());
    this.eventBus.subscribe("CenterSelectionHorizontally", (_msg, _data) => alignHCenter());

    this.eventBus.subscribe("ClearLog", (_msg, _data) => this.logger.clear());

    this.eventBus.subscribe("DeleteSelectedElements", (_msg, _data) => remove());

    this.eventBus.subscribe("ToggleInfo", (_msg, _data) => toggleInfo());
    this.eventBus.subscribe("ZoomIn", (_msg, _data) => this.zoomIn());
    this.eventBus.subscribe("ZoomOut", (_msg, _data) => this.zoomOut());

    this.eventBus.subscribe("CenterOnNode", (_msg, data) => this.centerOnNode(data));
    this.eventBus.subscribe("CenterOnNodes", (_msg, data) => this.centerOnNodes(data));

    this.eventBus.subscribe("ImportBlueprint", (_msg, _data) => this.importBlueprint());
    this.eventBus.subscribe("ExportBlueprint", (_msg, _data) => this.exportBlueprint());

    this.eventBus.subscribe("Toast", (_msg, { msg, lvl }) => toast[lvl || "info"](msg));

    this.eventBus.subscribe("SaveAsPNG", async (_msg, _data) => {
      const dataURI = await saveAsPNG();
      const { model } = this.engine;
      const { name } = model.getStartNode().prop("data/settings/parameters");
      saveAs(dataURI, { name, ext: "png" });
    });
    this.eventBus.subscribe("SaveAsSVG", async (_msg, _data) => {
      const dataURI = await saveAsSVG();
      const { model } = this.engine;
      const { name } = model.getStartNode().prop("data/settings/parameters");
      saveAs(dataURI, { name, ext: "svg" });
    });
    this.eventBus.subscribe("SaveAsBlueprint", (_msg, _data) => this.saveAsBlueprint());

    this.eventBus.subscribe("BlueprintLoaded", (_msg, _data) => this.engine.centerScroller());
    this.eventBus.subscribe("BlueprintChange", (_msg, _data) => this.onBlueprintChange());

    this.eventBus.subscribe("LoglineChunkClick", (_msg, data) => onLoglineChunkClick(data));

    this.eventBus.subscribe("ConnectivityStateChanged", (_msg, data) => {
      const { state } = data;

      // When the connected with the CLI gets closed, we want to unmark any nodes that might
      // have been marked as faulty (pulse highlight)
      if(state < CliConnectorStates.connected) {
        const engine = this.runtime.get("objects.engine");
        engine.unMarkAllAsFaulty();
      }
    });

    window.onerror = (msg, source, line, col, error) => {
      this.logger.error(`Error: ${msg}\nurl: ${source} (${line}:${col})\n${error})`);
      this.eventBus.publish("crash");
      return false; // show the error in the console
    }
    this.eventBus.subscribe("crash", (_msg, data) => new CrashHandler(data).handle());

    this.eventBus.subscribe("_debug_TraceSelectedNode", (_msg, _data) => this.traceSelectedNode());

    this.eventBus.subscribe("_debug_HighlightParentsOfSelectedNode", (_msg, _data) => this.highlightParentsOfSelectedNode());
    this.eventBus.subscribe("_debug_HighlightChildrenOfSelectedNode", (_msg, _data) => this.highlightChildrenOfSelectedNode());
    this.eventBus.subscribe("_debug_HighlightOutboundNeighborsOfSelectedNode", (_msg, _data) => this.highlightOutboundNeighborsOfSelectedNode());
    this.eventBus.subscribe("_debug_HighlightInboundNeighborsOfSelectedNode", (_msg, _data) => this.highlightInboundNeighborsOfSelectedNode());

    this.eventBus.subscribe("_debug_HighlightConnectedElements_children", (_msg, _data) => this.highlightConnectedElements("children"));
    this.eventBus.subscribe("_debug_HighlightConnectedElements_parents", (_msg, _data) => this.highlightConnectedElements("parents"));
    this.eventBus.subscribe("_debug_HighlightDisconnectedElements", (_msg, _data) => this.highlightDisconnectedElements());

    this.eventBus.subscribe("_debug_ValidateBlueprint", (_msg, _data) => this.validateBlueprint());
    this.eventBus.subscribe("_debug_ExposeSelection", (_msg, _data) => this.exposeSelection());
    this.eventBus.subscribe("_debug_PrintSerializedBlueprint", (_msg, _data) => this.printSerializedBlueprint());
    this.eventBus.subscribe("_debug_PrintNodeData", (_msg, _data) => this.printNodeData());

    /*
    this.eventBus.subscribe("_test_CreateLayout", (_msg, _data) => {
      const { collection } = this.engine.selection;
      this.layout = new Layout(collection.models[0]);
    });

    this.eventBus.subscribe("_test_Move10", (_msg, _data) => {
      const { collection } = this.engine.selection;

      this.layout.moveNodeToGridSegment([1, 0], collection.models[0]);
    });

    this.eventBus.subscribe("_test_Move10Displacement", (_msg, _data) => {
      const { collection } = this.engine.selection;

      let delta = this.layout.moveNodeToGridSegment([1, 0], collection.models[0]);
      this.layout.applyDeltaToNodes(delta, collection.models.slice(1));
      delta = this.layout.generateDeltaFromGridDisplacement([1, 0]);
      this.layout.avoidIntersections(delta, collection.models);
    });
    */

    this.gconfig.notifyOnChanges("ui.grid.size", (v) => {
      v = parseInt(v, 10); // make sure we have an int
      if(v == 0) {
        v = 1;
        this.gconfig.set("ui.grid.size", v);
      }
      this.runtime.get("objects.engine").setGridSize(v);
    });

    return this;
  }

  zoomIn() {
    this.engine.scroller.zoom(+0.1, {
      min: 0.2,
      max: 2.0,
    });
  }

  zoomOut() {
    this.engine.scroller.zoom(-0.1, {
      min: 0.2,
      max: 2.0,
    });
  }

  centerOnNode({ node_id }) {
    this.engine.centerOnNode({ node_id });
  }

  centerOnNodes({ node_ids }) {
    this.engine.centerOnNodes({ node_ids });
  }

  openNodeSettings(node_id) {
    const node = this.engine.model.getElements().find(n => n.id == node_id);

    if(!node.hasInfo()) {
      this.eventBus.publish("OpenNodeSettings", { node_id });
      return;
    }

    if(this.gconfig.get("ui.showInfo")) {
      this.eventBus.publish("OpenNodeInfo", { node_id });
      return;
    }

    this.eventBus.publish("OpenNodeSettings", { node_id });
  }

  importBlueprint() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".nbp";
    input.click();

    input.onchange = async e => {
      const file = e.target.files[0];
      const data = await loadFile(file);
      if(data === null) {
        this.logger.error(`Unexpected error while trying to parse the blueprint. Please make sure that you're importing a Nebulant blueprint.`);
      } else {
        importAsBlueprint(data);
      }
   }
  }

  exportBlueprint() {
    this.eventBus.publish("OpenOverlay", {
      message: "Exporting bueprint, please wait...",
    });

    exportBlueprintAsFile();

    this.eventBus.publish("CloseOverlay");
  }

  onBlueprintChange() {
    this.validateBlueprint();
  }

  async validateBlueprint() {
    const t1 = performance.now();
    const { model } = this.engine;
    let nodes = [model.getStartNode(), ...model.getConnectedElements()];
    const groups = nodes.filter(node => node.isGroup());
    nodes = nodes.filter(node => !node.isGroup());

    let warn_counter = 0;
    let err_counter = 0;

    for(const node of nodes) {
      const res = await node.validateSettings();
      const cellView = node.findView(this.engine);

      const warns = Object.keys(res.warnings).length;
      const errs = Object.keys(res.errors).length;

      if(warns || errs) {
        warn_counter += warns;
        err_counter += errs;
        this.engine.addToolsToOne(cellView);
      } else {
        this.engine.removeToolsFromOne(node);
      }
    }

    for(const group of groups) {
      const res = await group.validateSettings();
      const cellView = group.findView(this.engine);

      if(res.warnings || res.errors) {
        this.engine.addToolsToOne(cellView);
      } else {
        this.engine.removeToolsFromOne(group);
      }
    }

    model.getDisconnectedElements().forEach(node => {
      node.resetValidations();
      this.engine.removeToolsFromOne(node);
    });

    const t2 = performance.now();
    this.logger.debug(`Blueprint validation finished in ${(t2 - t1).toFixed(1)}ms`);

    this.runtime.set("state.warn_counter", warn_counter);
    this.runtime.set("state.err_counter", err_counter);
  }

  exposeSelection() {
    const { collection } = this.engine.selection;
    collection.toArray().forEach((node, index) => {
      window[`$${1+index}`] = node;
      this.logger.debug(`Exposing ${node.id} to $${1+index}`);
      window[`$${1+index}v`] = node.findView(this.engine);
      this.logger.debug(`Exposing ${node.id} view to $${1+index}`);
    });
  }

  printSerializedBlueprint() {
    const { model } = this.engine;

    const diagram = model.getCleanModel(
      model.getStartNode(),
      "children",
    ).serialize();

    const { actions, min_cli_version, isValid } = generateBlueprint(diagram);

    if(isValid) {
      this.logger.debug({ actions, min_cli_version });
    }
  }

  printNodeData() {
    const { collection } = this.engine.selection;
    collection.forEach((node, _index) => {
      this.logger.debug(node.prop("data/settings"));
    });
  }

  traceSelectedNode() {
    let selectedNodes = this.engine.selection.collection.filter(m => !m.isLink());
    switch (selectedNodes.length) {
      case 0:
        this.logger.info("Can't trace node because no node is selected.");
        break;

      case 1:
        const [node] = selectedNodes;
        const nodes = this.engine.model.getPredecessors(node, {
          deep: true,
        });
        this.engine.selection.collection.reset([...nodes, node]);
        break;

      default:
        this.logger.error("Can't trace more than 1 node at a time.");
        break;
    }
  }

  highlightParentsOfSelectedNode() {
    const { collection } = this.engine.selection;
    if(collection.length != 1) return;

    const [node] = collection.models;
    collection.reset([]);
    this.engine.model.getConnectedElements(node, "parents").forEach(
      node => this.engine.highlightOne(node)
    );
  }

  highlightChildrenOfSelectedNode() {
    const { collection } = this.engine.selection;
    if(collection.length != 1) return;

    const [node] = collection.models;
    collection.reset([]);
    this.engine.model.getConnectedElements(node, "children").forEach(
      node => this.engine.highlightOne(node)
    );
  }

  highlightOutboundNeighborsOfSelectedNode() {
    const { collection } = this.engine.selection;
    if(collection.length != 1) return;

    const [node] = collection.models;

    let nodes;
    if(node.isGroup()) {
      nodes = node.getNeighbors({ outbound: true });
    } else {
      nodes = this.engine.model.getNeighbors(node, { outbound: true });
    }

    collection.reset([]);
    nodes.forEach(node => this.engine.highlightOne(node));
  }

  highlightInboundNeighborsOfSelectedNode() {
    const { collection } = this.engine.selection;
    if(collection.length != 1) return;

    const [node] = collection.models;

    let nodes;
    if(node.isGroup()) {
      nodes = node.getNeighbors({ inbound: true });
    } else {
      nodes = this.engine.model.getNeighbors(node, { inbound: true });
    }

    collection.reset([]);
    nodes.forEach(node => this.engine.highlightOne(node));
  }

  highlightConnectedElements(direction) {
    const { collection } = this.engine.selection;
    if(collection.length != 1) return;

    const [node] = collection.models;
    const nodes = this.engine.model.getConnectedElements(node, direction);

    collection.reset([]);
    nodes.forEach(node => this.engine.highlightOne(node));
  }

  highlightDisconnectedElements() {
    const { collection } = this.engine.selection;
    collection.reset([]);
    this.engine.model.getDisconnectedElements().forEach(node => {
      this.engine.highlightOne(node);
    });
  }


}
