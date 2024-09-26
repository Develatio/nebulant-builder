import { util } from "@joint/core";
//import { Runtime } from "@src/core/Runtime";

const bringAllToFrontIfNecessary = util.debounce((selection) => {
  //const runtime = new Runtime();
  //const engine = runtime.get("objects.engine");

  selection.each(node => {
    // We could avoid having to change the "z" prop of each selected node (using
    // the commented code below), but there is a problem (as usual):
    //
    // if the user starts dragging the nodes, he'll eventually end up in a
    // situation in which the dragged nodes will be rendered below (instead of
    // above) other nodes on the canvas.
    // We don't want that. And there are two ways of achieving this:
    //
    // a) constantly scan the visual area of each node while it's being dragged
    // (using findViewsInArea()) and bring it to the front if required
    // b) bring all nodes to the front
    //
    // "a" is "better", since it would allow us to not change the "z" prop
    // unless required, but it would have a huge performance cost.
    // "b" is "meh", since it modifies the "z" prop of all nodes, but it's fast.

    /*
    // Avoid "change:z" on nodes if nothing changed visually
    let nodes = engine.findViewsInArea(node.getBBox()) || [];
    nodes = nodes.filter(view => view.model.id !== node.id);
    nodes = nodes.filter(view => view.model.prop("z") > node.prop("z"));

    if(nodes.length === 0) {
      // Modifying the z prop is not necessary, there is nothing on top of this
      // node.
      return;
    }
    */

    node.toFront();
  });
}, 100);

export const element_pointerdown = function(elementView, evt, x, y) {
  const { model } = elementView;

  // When a single element is clicked (with no CTRL / Meta keys)
  // we want to deselect everything and then select only the
  // element that was clicked...
  if(!evt.ctrlKey && !evt.metaKey) {
    if(this.selection.collection.get(model)) {
      // Do nothing
    } else {
      this.removeToolsFromAll(this.selection.collection.models);
      this.unHighlightAll(this.selection.collection.models);

      this.selection.collection.reset([model]);
      this.addToolsToOne(elementView);
    }
  }

  // When a single node is clicked while holding CTRL / Meta keys
  // we want to add it to the selection collection ... or remove it from
  // the selection collection if it's already there
  else if(evt.ctrlKey || evt.metaKey) {
    // If it was already selected, we want to deselect it
    if(this.selection.collection.get(model)) {
      this.selection.collection.remove(model);
    } else {
      this.selection.collection.add(model);
    }
  }

  // Right click
  else if(evt.which == 3 || evt.button == 2) {
    this.runtime.get("objects.blueprintAction").openNodeSettings(model.id);
  }

  // This will be used to calculate the offset when we're moving multiple
  // selected cells.
  this.dragPoint = { x, y };

  // We're clicking, potentially, on an array on nodes (there might be an active
  // selection). We want to move that array above all the other cells. But we
  // want to do all that *later*. The reason for this is that the "dblclick"
  // handler won't get triggered (which is bad, as the user might be
  // double-clicking on something) because calling ".toFront()" modifies the
  // DOM, which prevents JS from "remembering" which element was clicked.
  const selection = this.selection.collection.clone();
  bringAllToFrontIfNecessary.bind(this)(selection);
}
