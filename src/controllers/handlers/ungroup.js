import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export const ungroup = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");

  logger.debug("Grouping currently selected elements...");

  const cm = runtime.get("objects.commandManager");

  const selection = engine.selection.collection.clone();

  // Filter out any cells that are not groups.
  selection.filter(n => !n.isGroup()).forEach(n => selection.remove(n));

  // Start a batch operation. This will allow the user to undo / redo the
  // creation of the entire group (or the embedding of the new elements) as
  // one action instead of having to undo several actions.
  cm.initBatchCommand();

  selection.toArray().forEach(group => {
    const start = group.getStartNode();
    const end = group.getEndNode();

    const children = group.getEmbeddedCells();
    group.removeFromGroup(children);

    start.remove();
    end.remove();
    group.remove();
  })

  engine.selection.collection.reset([]);

  // End the batch operation
  cm.storeBatchCommand();
}
