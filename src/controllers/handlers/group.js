import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { Layout } from "@src/engine/Layout";

export const group = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");
  const shapes = runtime.get("objects.shapes");

  logger.debug("Grouping currently selected elements...");

  const cm = runtime.get("objects.commandManager");

  const selection = engine.selection.collection.clone();

  if(selection.length < 2) return;

  // Filter out any cells that are not groupable. This can happen if the user
  // selects an ungroupable node (eg. "Start") and then drags some cell on top
  // of another cell.
  selection.filter(n => !n.get("groupable")).forEach(n => selection.remove(n));

  const { x, y } = engine.model.getCellsBBox(selection.toArray());

  // We are creating a group and inserting in it a bunch of cells which might
  // have a parent. If so, we want to store the parent of one of them so we can
  // then embed the newly created group in that parent...
  const parent = selection.models[0].getParentCell();

  // Start a batch operation. This will allow the user to undo / redo the
  // creation of the entire group (or the embedding of the new elements) as
  // one action instead of having to undo several actions.
  cm.initBatchCommand();

  // Create the actual group and add to it the "selection"
  const group = new shapes.nebulant.rectangle.group.Group();
  group.addTo(engine.model);
  group.position(x, y);
  group.bootstrap();
  group.addToGroup(selection.models);

  const layout = new Layout(group);
  let delta = layout.moveNodeToGridSegment([1, 0], selection.models[0]);
  layout.applyDeltaToNodes(delta, selection.models.slice(1));
  delta = layout.generateDeltaFromGridDisplacement([1, 0]);
  layout.avoidIntersections(delta, selection.models, group);

  engine.selection.collection.reset([]);

  // ... check if we got any parent, and if so, embed the group into it
  if(parent) parent.addToGroup([group]);

  // End the batch operation
  cm.storeBatchCommand();
}
