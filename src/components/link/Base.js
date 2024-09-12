import { g, util, dia, shapes, linkTools } from "@joint/core";
import { Highlighter } from "./Highlighter";
import { Runtime } from "@src/core/Runtime";
import { Logger } from "@src/core/Logger";

export class Base extends shapes.standard.Link {
  defaults() {
    return util.merge({}, super.defaults, {
      type: "nebulant.link.Base",

      removable: true,
      deformable: true,

      highlighter: Highlighter,

      attrs: {
        line: {
          stroke: "#ccc",
          strokeWidth: 2,
          //sourceMarker: {
          //  type: "path",
          //  // Created with https://yqnn.github.io/svg-path-editor/
          //  d: "m -5 -5 c 7 0 7 10 0 10",
          //  fill: "none",
          //  strokeWidth: 2,
          //},
          targetMarker: {
            type: "path",
            // Created with https://yqnn.github.io/svg-path-editor/
            //d: "m 1 0 l 11 -5 l 0 10 z m -6.5 5 a 1 1 0 1 0 0 -10 a 1 1 0 0 1 0 10",
            d: "m 1 0 l 6 -3 l 0 6 z",
            //fill: "#8B6AFF",
            //stroke: "#8B6AFF",
            strokeWidth: 2,
          },
        },
      },
    });
  }

  markup = [
    {
      tagName: "path",
      selector: "lineglow",
      attributes: {
        "fill": "none",
        "pointer-events": "none"
      }
    },
    {
      tagName: "path",
      selector: "wrapper",
      attributes: {
        "fill": "none",
        "cursor": "pointer",
        "stroke": "transparent",
        "stroke-linecap": "butt"
      }
    },
    {
      tagName: "path",
      selector: "bgline",
      attributes: {
        "fill": "none",
        stroke: "transparent",
        strokeWidth: 1.8,
        "pointer-events": "none",
        d: "",
      }
    },
    {
      tagName: "path",
      selector: "line",
      attributes: {
        "fill": "none",
        "pointer-events": "none"
      }
    }
  ];

  constructor(attributes = {}, options = {}) {
    //dia.Element.prototype.constructor.call(this, attributes, options);
    super(attributes, options);

    // This allows us to set the color of the link so that it matches the color
    // of it's source port.
    this.on("change:source", this.setColorFromSourcePort);

    // The user might add or delete vertices / segments and he/she might apply
    // changes to them, which will lead to the link changing it's shape. We must
    // update the path of the bgline and the lineglow in order to reflect the
    // change of the shape.
    this.on("change:vertices", (model) => {
      const max_runs = 10;
      let runs = 0;

      const updatePaths = () => {
        const runtime = new Runtime();
        const engine = runtime.get("objects.engine");
        const view = model.findView(engine);

        if(!view.path) {
          if(runs >= max_runs) {
            const logger = new Logger();
            logger.error("Reached max attempts to update the path of the link. Aborting...");
            return;
          }
          runs += 1;
          setTimeout(updatePaths);
          return;
        }

        const path = g.Path(view.path.segments).serialize();
        view?.selectors?.bgline?.setAttribute?.("d", path);

        // If the link isn't fully created we shouldn't set the path of the
        // lineglow element since that will cause visual glitches. This can
        // happen when the link is created by clicking on a source port
        // (instead of dragging).
        if(!model.prop("_not_fully_created")) {
          view?.selectors?.lineglow?.setAttribute?.("d", path);
        }
      }

      // We need the setTimeout because the segments are still in the
      // to-be-updated queue.
      setTimeout(updatePaths);
    });

    // This is a temp prop that allows us to decide whether to render the link
    // in Engine::viewport
    if(!this.target()?.id) {
      this.prop("_not_fully_created", true);
    }

    // This must be inside a setTimeout because we want the link to be assigned
    // to a source and to a target cells before making any further assumptions
    // about the color of the ports that the link is connected to.
    setTimeout(() => {
      this.setColorFromSourcePort();
    });
  }

  // target() might be called in one of the following occasions:
  //
  // 1) The user dragged and dropped a link, effectively creating it
  // 2) Something / someone wanted to GET the target of the link, thus NOT
  //    passing any arguments to the method
  // 3) Something / someone created a link programatically and THEN assigned a
  //    target to it.
  //
  // We're interested in the third case. That one occurs when
  //    a) groups are created.
  //    b) links are created by clicking on a source port (instead of dragging)
  // Since we're programatically creating the links, the "link_connected" event
  // doesn't get triggered, which leaves the link in an incorrect
  // "_not_fully_created" state. We want to avoid this by setting that property
  // to "false" if the link is assigned a target.
  target(target, args, opt) {
    if(target?.id) {
      this.prop("_not_fully_created", false);
    }
    return dia.Link.prototype.target.call(this, target, args, opt);
  }

  // This will get called when a link is clicked. It will add the Vertices and
  // the Segments tools, which are used to allow the user to modify the path of
  // the link.
  addTools({ elementView, scale }) {
    const tools = [];

    // The order of these 2 ifs is important. We want to add the vertices first,
    // then the "Remove" button. If we did it the other way, the vertices would
    // have higher z index and clicking on the "Remove" button will trigger a
    // vertex action.

    if(this.prop("deformable")) {
      tools.push(new linkTools.Vertices({
        scale,
        // TODO: Add "vertexAdding" and "vertexRemoving" ?
      }));
      if(elementView.model.attributes.type !== "nebulant.link.Smart") {
        tools.push(new linkTools.Segments({ scale }));
      }
    }

    if(this.prop("removable")) {
      tools.push(new linkTools.Remove({
        scale,
        offset: 20,
        distance: 40,
        markup: [
          {
            tagName: "rect",
            selector: "background",
            attributes: {
              width: 32,
              height: 32,
              fill: "#333045E5",
              rx: 6,
              ry: 6,
            },
          },
          {
            tagName: "path",
            selector: "cross",
            attributes: {
                d: "m 11 11 l 11 11 m -11 0 l 11 -11 z",
                fill: "none",
                strokeLinecap: "round",
                stroke: "#FFFFFF",
                strokeWidth: 1.5,
                pointerEvents: "none",
            },
          },
        ],
      }));
    }

    if(tools.length > 0) {
      const toolsView = new dia.ToolsView({ tools });
      elementView.addTools(toolsView);
    }
  }

  setColorFromSourcePort() {
    const source = this.prop("source");
    const source_id = source.id;
    const source_port_id = source.port;

    let model;
    // This happens when we're deserializing a diagram (when we're loading the
    // page)
    if(this.graph || this.collection?.graph) {
      model = this.graph || this.collection?.graph;
    } else {
      // This happens when we're actively using the builder
      const runtime = new Runtime();
      model = runtime.get("objects.main_model");
    }

    const element = model.getCell(source_id);

    // Note that in the previous "if/else", we assumed that the link belongs
    // to the main model. This isn't always the case. Several features in the
    // app require temporal models (autocompleters, clipboard, etc...).
    // If one of those models triggered this event, we'll end up without an
    // element, as we've tried searching for the element's ID in the incorrect
    // model.
    // This is OK, we just won't be able to set the "right" color for the link.
    if(!element) {
      return;
    }

    const ports = element.prop("ports");
    const port = ports.items.find(port => port.id == source_port_id);
    const group = ports.groups[port.group];
    const color = group.attrs.circle["link-color"] || "#ccc";

    this.attr({
      line: { stroke: color },
      lineglow: { stroke: color },
    }, { skip_undo_stack: true });
  }

  isGroup() {
    return false;
  }

  // This method will return the name of the port group to which the link is
  // connected to. Keep in mind that a link must be connected to 2 nodes (source
  // and target nodes), so you must specify which node you want to check (by
  // passing the "node" parameter).
  getPortGroupOfConnectedNode(node) {
    const portToGroupMap = node.getPorts().map(port => ({
      [port.id]: port.group,
    })).reduce((acc, obj) => ({...acc, ...obj }), {});
    const inLinks = this.graph.getConnectedLinks(node, { inbound: true });
    let match = inLinks.find(inLink => inLink.id === this.id);

    if(match) {
      return portToGroupMap[match.target().port];
    }

    const outLinks = this.graph.getConnectedLinks(node, { outbound: true });
    match = outLinks.find(outLink => outLink.id === this.id);

    if(match) {
      return portToGroupMap[match.source().port];
    }

    return undefined;
  }

  toJSON() {
    const res = shapes.standard.Link.prototype.toJSON.call(this);

    // Remove fields that should not be serialized
    const saveOnly = [
      "connector",
      "id",
      "parent",
      "router",
      "source",
      "target",
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
}
