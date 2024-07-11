import { Layout } from "@src/engine/Layout";

export const element_pointerup = function(cellView, _evt, x, y) {
  const cm = this.runtime.get("objects.commandManager");
  const engine = this.runtime.get("objects.engine");
  const shapes = this.runtime.get("objects.shapes");

  // Restore the gridSize we modified in the "cell:pointerdown" event
  this.options.gridSize = this.gconfig.get("ui.grid.size");

  const cell = cellView.model;

  // Find out if the center of this cell is above something.
  //const rect = cell.getBBox();
  //const p = rect.center();

  // Find out if there is something right under the position of the cursor
  const p = { x, y };
  let cellModelsBelowCenter;

  if(engine.hasEngineLayers()) {
    const group = engine.getCurrentEngineLayer();
    cellModelsBelowCenter = this.model.findModelsFromPointInGroup(p, group);
  } else {
    cellModelsBelowCenter = this.model.findModelsFromPointInGroup(p, null);
  }

  cellModelsBelowCenter = cellModelsBelowCenter.filter(c => {
    // findModelsFromPoint() returns the model of the `cell` itself, so we must
    // filter that as well
    return c.id !== cell.id;
  });

  // If the cursor is not above anything, it means that the user
  // dropped the cell onto the canvas itself.
  if(cellModelsBelowCenter.length == 0) {
    // Find if we're inside a layer and if so, embed the cell into the current
    // layer.
    if(engine.hasEngineLayers()) {
      const group = engine.getCurrentEngineLayer();
      group.embed(cell);
    }

    // We can stop here; nothing more to do.
    return;
  }

  // If we got here it means that there is something below this cell

  // There might be more than one thing below this cells, so sort by z index and
  // pick the first one
  const cellBelow = cellModelsBelowCenter.sort((a, b) => {
    return b.prop("z") - a.prop("z");
  })[0];

  // If the cell is not groupable (eg: "Start" or "End" nodes), we must
  // immediately abort and undo the action so the user can know that this
  // action is not allowed.
  if(!cell.prop("groupable")) {
    setTimeout(() => cm.cancel());
    return;
  }

  // If we got this far it means that we must either create a new group or
  // embbed into an existing group

  // Let's prepare an array that contains the selected nodes. We will need it
  // shortly...
  const selection = this.selection.collection.clone();

  // If the cell that triggered the pointerup event is not selected, select it
  if(!selection.get(cell)) selection.push(cell);

  // Filter out any cells that are not groupable. This can happen if the user
  // selects an ungroupable node (eg. "Start") and then drags some cell on top
  // of another cell.
  selection.filter(n => !n.get("groupable")).forEach(n => selection.remove(n));

  // The fun part begins...

  // If it's a group we must embed the cell (and the remaining selection) that
  // triggered the pointerup event...
  if(cellBelow.isGroup()) {
    // Start a batch operation. This will allow the user to undo / redo the
    // creation of the entire group (or the embedding of the new elements) as
    // one action instead of having to undo several actions.
    cm.initBatchCommand();

    // If the cellBelow is in the selection and it's a group, deselect it.
    // This can happen when the user clicks on a group and then drags another
    // cell into it.
    if(selection.get(cellBelow)) selection.remove(cellBelow);

    // By using "selection" instead of "cell" we're taking into account that the
    // cell that triggered the pointerup event might be part of a selection.
    // This allows us to embbed all the selected cells instead of only
    // embedding the cell that triggered the pointerup event.
    cellBelow.addToGroup(selection.models);

    const layout = new Layout(cellBelow.getStartNode());
    let delta = layout.moveNodeToGridSegment([1, 0], selection.models[0]);
    layout.applyDeltaToNodes(delta, selection.models.slice(1));
    delta = layout.generateDeltaFromGridDisplacement([1, 0]);
    layout.avoidIntersections(delta, selection.models, cellBelow);

    // End the batch operation
    cm.storeBatchCommand();
  }

  // ...else it's a simple node, so we most probably need to create a new group.
  else {
    // But first, we must check if "cellBelow" is "groupable" (that it can be
    // used to create a new group; e.g. "Start" and "End" nodes are NOT
    // groupable), in which case we actually don't want to create a new group;
    // instead we want to call "cancel()" because that will let the user know
    // that creating a new group using that particular cellBelow node is not
    // supported.
    if(!cellBelow.get("groupable")) {
      setTimeout(() => cm.cancel());
      return;
    }

    // ...ok, it's a simple node and it's "groupable". Create a new group!

    // Start a batch operation. This will allow the user to undo / redo the
    // creation of the entire group (or the embedding of the new elements) as
    // one action instead of having to undo several actions.
    cm.initBatchCommand();

    // We dropped a cell (or an array of cells) onto <something> ("cellBelow").
    // That <something> might have a parent. If so, we want to store the parent
    // so we can then embed the newly created group in that parent...
    const parent = cellBelow.getParentCell();

    // Create the actual group and add to it the "selection"
    const group = new shapes.nebulant.rectangle.group.Group();
    const { width, height } = group.getBBox();
    group.addTo(this.model);
    group.position(x - width / 2, y - height / 2);
    group.bootstrap();
    group.addToGroup([...selection.models, cellBelow]);

    const layout = new Layout(group);
    layout.moveNodeToGridSegment([-1, 2], cellBelow);
    let delta = layout.moveNodeToGridSegment([1, 2], cell);
    layout.applyDeltaToNodes(delta, selection.models.filter(n => n.id !== cell.id));
    delta = layout.generateDeltaFromGridDisplacement([1, 0]);
    layout.avoidIntersections(delta, selection.models, group);

    // ... check if we got any parent, and if so, embed the group into it
    if(parent) parent.addToGroup([group]);

    // End the batch operation
    cm.storeBatchCommand();
  }
}
