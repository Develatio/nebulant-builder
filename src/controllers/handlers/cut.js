import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export const cut = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");
  const keyboard = runtime.get("objects.keyboard");

  // Cut the currently selected element(s) to the clipboard
  logger.debug("Cutting currently selected elements...");

  // Get only the nodes that can actually be cut
  const collection = engine.selection.collection.clone();
  collection.reset(
    collection.filter(node => node.prop("removable"))
  );

  keyboard.clipboard.cut(collection, engine.model);
}
