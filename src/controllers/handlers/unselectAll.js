import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export const unselectAll = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");

  logger.debug("Unselecting all elements...");

  const { collection } = engine.selection;

  collection.reset([]);
}
