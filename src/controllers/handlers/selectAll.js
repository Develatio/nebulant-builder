import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export const selectAll = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");

  logger.debug("Selecting all elements...");

  const { collection } = engine.selection;

  const start = engine.model.getStartNode();
  const elements = engine.model.getElements().filter(node => node.id != start.id);

  collection.reset(elements);
}
