import { throttle } from "lodash-es";

import { dia, util } from "@joint/core";
import { Selection } from "@joint/selection";
import { Navigator } from "@joint/navigator";
import { PaperScroller } from "@joint/paper-scroller";

import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { shapes } from "@src/components/shapes";

import { viewport } from "@src/engine/base/viewport";
import { defaultRouter } from "@src/engine/base/defaultRouter";
import { validateConnection } from "@src/engine/base/validateConnection";

import { add } from "@src/engine/selection/add";
import { reset } from "@src/engine/selection/reset";
import { remove } from "@src/engine/selection/remove";

import { highlightOne } from "@src/engine/enhancers/highlightOne";
import { unHighlightOne } from "@src/engine/enhancers/unHighlightOne";
import { unHighlightAll } from "@src/engine/enhancers/unHighlightAll";

import { markOneAsFaulty } from "@src/engine/enhancers/markOneAsFaulty";
import { unMarkOneAsFaulty } from "@src/engine/enhancers/unMarkOneAsFaulty";
import { unMarkAllAsFaulty } from "@src/engine/enhancers/unMarkAllAsFaulty";

import { addToolsToOne } from "@src/engine/enhancers/addToolsToOne";
import { rescaleAllTools } from "@src/engine/enhancers/rescaleAllTools";
import { removeToolsFromOne } from "@src/engine/enhancers/removeToolsFromOne";
import { removeToolsFromAll } from "@src/engine/enhancers/removeToolsFromAll";

import { scale } from "@src/engine/handlers/scale";

import { link_connect } from "@src/engine/handlers/link_connect";
import { link_pointerup } from "@src/engine/handlers/link_pointerup";
import { link_mouseenter } from "@src/engine/handlers/link_mouseenter";
import { link_mouseleave } from "@src/engine/handlers/link_mouseleave";
import { link_pointerclick } from "@src/engine/handlers/link_pointerclick";

import { paper_pan } from "@src/engine/handlers/paper_pan";
import { paper_pinch } from "@src/engine/handlers/paper_pinch";
import { paper_mouseenter } from "@src/engine/handlers/paper_mouseenter";
import { paper_mouseleave } from "@src/engine/handlers/paper_mouseleave";

import { cell_pointerdown } from "@src/engine/handlers/cell_pointerdown";

import { element_pointerup } from "@src/engine/handlers/element_pointerup";
import { element_mouseenter } from "@src/engine/handlers/element_mouseenter";
import { element_mouseleave } from "@src/engine/handlers/element_mouseleave";
import { element_pointerdown } from "@src/engine/handlers/element_pointerdown";
import { element_pointermove } from "@src/engine/handlers/element_pointermove";
import { element_contextmenu } from "@src/engine/handlers/element_contextmenu";
import { element_pointerclick } from "@src/engine/handlers/element_pointerclick";
import { element_pointerdblclick } from "@src/engine/handlers/element_pointerdblclick";
import { element_magnet_pointerclick } from "@src/engine/handlers/element_magnet_pointerclick";

import { blank_pointerup } from "@src/engine/handlers/blank_pointerup";
import { blank_pointerdown } from "@src/engine/handlers/blank_pointerdown";
import { blank_pointerclick } from "@src/engine/handlers/blank_pointerclick";

export class BaseEngine extends dia.Paper {
  constructor(opts) {
    const gconfig = new GConfig();
    const runtime = new Runtime();

    runtime.set("state.canvasLayers", []);

    opts = util.merge({}, {
      frozen: false,
      autoFreeze: true,
      async: true,

      width: 1500,
      height: 1500,

      drawGrid: {
        name: "mesh",
        color: "#332F4B",
        thickness: 1,
      },
      embeddingMode: false,

      gridSize: gconfig.get("ui.grid.size"),
      drawGridSize: 20,

      sorting: dia.Paper.sorting.APPROX,

      preventDefaultBlankAction: false,
      preventDefaultViewAction: false,

      clickThreshold: 1,
      moveThreshold: 1,

      linkPinning: false, // We don't want orphan links

      // Attract links to ports from a certain distance
      snapLinks: {
        radius: 30,
      },

      // Prevent more than one link between the same source and target port
      multiLinks: false,

      preventContextMenu: !gconfig.get("advanced.debug"),

      cellViewNamespace: shapes,

      interactive: () => runtime.get("state.engine_options.interactive"),

      defaultLink: (_cellView, _magnet) => {
        const linkClass = this.getDefaultLinkClass();
        return new linkClass();
      },

      defaultRouter: (vertices, opts, linkView) => {
        return defaultRouter.bind(this)(vertices, opts, linkView);
      },

      defaultConnector: {
        name: "jumpover",
        args: {
          jump: "gap",
          radius: 10,
        },
      },

      /*
      connectionStrategy: (end, view, _magnet, coords) => {
        end.anchor = {
          name: view.model.getBBox().sideNearestToPoint(coords),
        };
      },
      */

      // Offset distance between the ports and the links
      defaultConnectionPoint: {
        name: "bbox",
        args: {
          offset: 0,
        },
      },

      validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
        return validateConnection.bind(this)(cellViewS, magnetS, cellViewT, magnetT, end, linkView);
      },

      viewport: (view) => viewport.bind(this)(view),
    }, opts);

    super(opts);

    this.gconfig = gconfig;
    this.runtime = runtime;
    this.eventBus = new EventBus();

    this.logger = this.runtime.get("objects.logger");
    this.keyboard = this.runtime.get("objects.keyboard");

    this.selection = new Selection({
      paper: this,
      strictSelection: true,
    });
    this.selection.removeHandle("remove");
    this.selection.removeHandle("rotate");
    this.selection.removeHandle("resize");

    // Initialize the engine and the scroller
    this.scroller = new PaperScroller({
      paper: this,
      autoResizePaper: true,
      scrollWhileDragging: {
        padding: {
          top: -50,
          left: -350,
          right: -350,
          bottom: -50,
        },
      },
      inertia: {
        friction: 0.95,
      },
      borderless: true,
      padding: 5000,
      cursor: "grab",
    });
  }

  getDefaultLinkClass() {
    const ltype = this.gconfig.get("ui.links.type");

    const typemap = {
      simple: shapes.nebulant.link.Simple,
      smart: shapes.nebulant.link.Smart,
      static: shapes.nebulant.link.Static,
    };

    return typemap[ltype] || shapes.nebulant.link.Simple;
  }

  drawOn(selector) {
    document.querySelector(selector).appendChild(this.scroller.render().el);
  }

  drawMinimapOn(selector) {
    // Initialize the minimap
    this.minimap = new Navigator({
      paperScroller: this.scroller,
      width: 150,
      height: 100,
      padding: 0,
      zoomOptions: {
        max: 2,
        min: 0.2,
      },
      useContentBBox: true,
      paperOptions: {
        async: true,
        sorting: dia.Paper.sorting.APPROX,
        cellViewNamespace: shapes,
        viewport: (view) => viewport.bind(this)(view),
      },
    });

    document.querySelector(selector).appendChild(this.minimap.el);
    this.minimap.render();
  }

  pushLayer(group) {
    const zoom = this.scroller.zoom();
    const { x, y } = this.scroller.getVisibleArea().center();
    const layer = {
      x,
      y,
      zoom,
      group_id: group.id,
    };

    const canvasLayers = this.runtime.get("state.canvasLayers");
    this.runtime.set("state.canvasLayers", [...canvasLayers, layer]);

    this.eventBus.publish("BlueprintChange");
    this.checkViewport();

    const startNode = group.getStartNode();
    setTimeout(() => {
      this.centerOnNode({ node_id: startNode.id, duration: 0 });
    });
  }

  getEngineLayers() {
    return this.runtime.get("state.canvasLayers");
  }

  getCurrentEngineLayer() {
    const layers = this.getEngineLayers();
    const { group_id } = layers.at(-1);
    return this.model.getCell(group_id);
  }

  hasEngineLayers() {
    return this.getEngineLayers().length > 0;
  }

  resetEngineLayers(idx = 0) {
    const layers = this.getEngineLayers();

    if(layers.length === 0 && idx === 0) {
      this.runtime.set("state.canvasLayers", []);
      return;
    }

    const { x, y, zoom } = layers[idx];

    this.runtime.set("state.canvasLayers", layers.slice(0, idx));

    this.eventBus.publish("BlueprintChange");
    this.checkViewport();

    setTimeout(() => {
      this.scroller.center(x, y);
      this.scroller.zoom(zoom, { absolute: true });
    });
  }

  getCenter() {
    const { width, height } = this.getComputedSize();
    return [width / 2, height / 2];
  }

  centerScroller() {
    this.logger.debug("Centering blueprint...");

    const zoom = this.model.get("zoom") || 1;
    this.logger.debug(`\tzoom -> ${zoom}`);

    let x = this.model.get("x");
    this.logger.debug(`\tx -> ${x}`);

    let y = this.model.get("y");
    this.logger.debug(`\ty -> ${y}`);

    // Set the zoom level (maybe use the value that was saved in the blueprint)
    this.scroller.zoom(zoom, { absolute: true });

    // ... and the position of the paper, or center to the "middle"
    if(x && y) {
      this.scroller.center(x, y);
    } else {
      const startNode = this.model.getStartNode();
      ({ x, y } = startNode.getBBox().center());
      this.scroller.center(x, y);
    }

    // ... and after all this work, maybe there isn't anything visible, which is
    // a really bad UX. If this is the case, just focus on the main "Start" node
    const nodes = this.findViewsInArea(this.scroller.getVisibleArea()) || [];

    if(nodes.length === 0) {
      const startNode = this.model.getStartNode();
      startNode && this.centerOnNode({ node_id: startNode.id });
    }
  }

  centerOnNode({ node_id, duration }) {
    const node = this.model.getCell(node_id);

    // Center the paper scroller so that the node will be on the center of the screen
    this.scroller.scrollToElement(node);

    // Highlight the node
    this.unHighlightAll();
    this.highlightOne(node);
  }

  centerOnNodes({ node_ids }) {
    const nodes = node_ids.map(node_id => this.model.getCell(node_id));

    // Center all selected cells
    //const zoom = this.scroller.zoom();
    this.scroller.transitionToRect(this.model.getCellsBBox(nodes), {
      //minScale: zoom,
      //maxScale: zoom,
      visibility: 0.5,
      duration: "250ms",
    });

    // Highlight the nodes
    this.unHighlightAll();
    nodes.forEach(node => this.highlightOne(node));
  }

  removeToolsFromOne(model) {
    removeToolsFromOne.bind(this)(model);
  }

  addToolsToOne(elementView, scale) {
    addToolsToOne.bind(this)(elementView, scale);
  }

  removeToolsFromAll(models) {
    removeToolsFromAll.bind(this)(models);
  }

  highlightOne(model, opts = {}) {
    highlightOne.bind(this)(model, opts);
  }

  unHighlightOne(model, opts = { caller: "" }) {
    unHighlightOne.bind(this)(model, opts);
  }

  unHighlightAll(models) {
    unHighlightAll.bind(this)(models);
  }

  markOneAsFaulty(model) {
    markOneAsFaulty.bind(this)(model);
  }

  unMarkOneAsFaulty(model) {
    unMarkOneAsFaulty.bind(this)(model);
  }

  unMarkAllAsFaulty(models) {
    unMarkAllAsFaulty.bind(this)(models);
  }

  initEventHandlers() {
    this.on({
      // Start selecting elements or moving the renderer
      "blank:pointerdown": blank_pointerdown,

      "blank:pointerup": blank_pointerup,

      // If we click on an empty area:
      // 1) remove tools from all elements
      // 2) unhighlight all elements
      // 3) remove all elements from the selection
      "blank:pointerclick": blank_pointerclick,

      "cell:pointerdown": cell_pointerdown,

      "element:pointerup": element_pointerup,
      "element:pointerdown": element_pointerdown,

      "element:pointermove": element_pointermove,

      "element:pointerclick": element_pointerclick,

      "element:pointerdblclick": element_pointerdblclick,

      // Open settings on right click
      "element:contextmenu": element_contextmenu,

      "element:magnet:pointerclick": element_magnet_pointerclick,

      // Highlight elements
      "element:mouseenter": element_mouseenter,
      "element:mouseleave": element_mouseleave,

      // Select links
      "link:pointerclick": link_pointerclick,
      "link:pointerup": link_pointerup,

      // Highlight links
      "link:mouseenter": link_mouseenter,
      "link:mouseleave": link_mouseleave,

      "link:connect": link_connect,

      // Save the zoom level in the blueprint
      "scale": throttle(() => {
        scale.call(this);
        rescaleAllTools.call(this);
      }, 250),

      "paper:pinch": paper_pinch,
      "paper:pan": paper_pan,

      // We want the keyboard mapper to kick in only when the mouse is hovering the canvas.
      // If we don't do that, trying to CTRL+C something from the log viewer will trigger
      // a cell copy (just to give an example).
      "paper:mouseenter": paper_mouseenter,
      "paper:mouseleave": paper_mouseleave,
    });

    document.addEventListener('contextmenu', (evt) => {
      if(this.runtime.get("state.creating_link")) {
        evt.preventDefault();
      }
    });

    this.pointerup = function(evt) {
      const view = this.eventData(evt).sourceView;
      if(view) {
        const { linkView, action } = view.eventData(evt);
        if(action === "magnet" && linkView && evt.button === 2) {
          const normalizedEvt = util.normalizeEvent(evt);
          const { x, y } = this.clientToLocalPoint({
            x: normalizedEvt.clientX,
            y: normalizedEvt.clientY,
          });
          linkView.model.vertices(linkView.model.vertices().concat({ x, y }));
          return;
        }
      }
      dia.Paper.prototype.pointerup.call(this, evt);
    }

    this.selection.collection.on({
      "add": add.bind(this),
      "reset": reset.bind(this),
      "remove": remove.bind(this),
    });
  }
}
