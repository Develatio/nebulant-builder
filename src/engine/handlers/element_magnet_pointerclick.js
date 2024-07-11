import { Logger } from "@src/core/Logger";
import { validateConnection } from "@src/engine/base/validateConnection";

// This handler will allow users to create links by clicking on a source port
// (instead of dragging) and then:
//    * clicking on empty area to create a new vertex
//    * clicking on a target port to finish creating the link
export const element_magnet_pointerclick = function(elementView, _evt, magnet, x, y) {
  const sourceId = elementView.model.id;
  const sourcePort = elementView.findAttribute('port', magnet);
  const cellViewS = elementView;
  const magnetS = magnet;

  const ccl = this.runtime.get("state.creating_link");

  // If we're creating a link and the user clicked on the same port that was
  // used to start the creation of the link, abort.
  if(ccl?.sourceId === sourceId && ccl?.sourcePort === sourcePort) {
    return;
  }

  // If we're NOT creating a link and the user clicked on an "IN" port, abort.
  const group = elementView.model.getPorts().find(p => p.id === sourcePort).group;
  if(!ccl && group === "in") return;

  // If we're creating a link and there was a magnet:pointerclick event it means
  // that the user clicked on another port. The click was already handled by the
  // "onPointerup" handler, so we just need to abort.
  if(ccl) return;

  this.runtime.set("state.creating_link", { sourceId, sourcePort });

  const { model } = elementView.paper;
  model.startBatch("add-link");

  const linkClass = this.getDefaultLinkClass();
  let link = new linkClass({
    source: { id: sourceId, port: sourcePort },
    target: { x, y },
    attrs: {
      root: { pointerEvents: "none" },
      line: { targetMarker: null }
    },
  });

  model.addCell(link);

  const done = (link = null) => {
    model.stopBatch("add-link");
    document.removeEventListener("pointermove", onPointermove);
    document.removeEventListener("pointerup", onPointerup);
    document.removeEventListener("keydown", onEscape);

    if(!link) return;

    // This callback is fired when the user *clicks* on a *port* (which happens
    // to be attached to a node), which causes the node to get highlighted, its
    // tools get added and the link itself also gets highlighted. But the user
    // didn't actually click on the node itself, so highlighting the node (or
    // adding it's tools) it an unexpected behaviour. As for the link, well...
    // since it gets highlighted and the cursor is **NOT** hovering it, this
    // leads to the highlight staying forever (or until the user blank_clicks),
    // which is also unexpected behaviour. This is actually an edge case that
    // might happen (not guaranteed) only when the user creates links by
    // clicking instead of dragging, but I just can't help myself and I **HAD**
    // to fix this. jfc why am I like this?! :(
    const max_runs = 10;
    let runs = 0;

    const workaroundUnexpectedBehavior = () => {
      const engine = this.runtime.get("objects.engine");
      const view = link.findView(engine);
      if(!view.path) {
        if(runs >= max_runs) {
          const logger = new Logger();
          logger.error("Reached max attempts to find the path of the link. Aborting...");
          return;
        }
        runs += 1;
        setTimeout(workaroundUnexpectedBehavior);
        return;
      }

      engine.removeToolsFromAll();
      engine.unHighlightAll();

      if(this.selection.collection.models.length > 0) {
        this.selection.collection.reset([]);
      }

      engine.highlightOne(link);
      engine.unHighlightOne(link);
    }

    setTimeout(workaroundUnexpectedBehavior);
  };

  const onPointermove = (evt) => {
    const p = this.clientToLocalPoint({ x: evt.clientX, y: evt.clientY });
    link.target(p);
  };

  const onPointerup = (evt) => {
    // Undo the last vertex on right click
    if(evt.button === 2) {
      link.vertices(link.vertices().slice(0, -1));
      return;
    }

    const view = this.findView(evt.target);
    if(!view) {
      const p = this.clientToLocalPoint({ x: evt.clientX, y: evt.clientY });
      link.vertices(link.vertices().concat(p.toJSON()));
      return;
    }

    const cellViewT = view;
    const end = "target";
    const magnetT = evt.target;
    if(validateConnection(cellViewS, magnetS, cellViewT, magnetT, end, null)) {
      const targetPort = view.findAttribute("port", evt.target);
      const currentVertices = link.vertices();

      link.remove();

      link = new linkClass();
      link.source({ id: sourceId, port: sourcePort });
      link.target({ id: view.model.id, port: targetPort });
      link.addTo(model).reparent();
      link.vertices(currentVertices);

      // Emit link:connect event
      const linkView = this.findViewByModel(link);
      const engine = this.runtime.get("objects.engine");
      engine.trigger("link:connect", linkView);

      done(link);
      return;
    }
  };

  const onEscape = (evt) => {
    if(evt.key === "Escape") {
      this.runtime.set("state.creating_link", false);
      link.remove();
      done();
    }
  };

  document.addEventListener("pointermove", onPointermove);
  document.addEventListener("pointerup", onPointerup);
  document.addEventListener("keydown", onEscape);
}
