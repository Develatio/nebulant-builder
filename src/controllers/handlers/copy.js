import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export const copy = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");
  const keyboard = runtime.get("objects.keyboard");

  // Copy the currently selected element(s) to the clipboard
  logger.debug("Copying currently selected elements...");

  // Create a copy of the selection
  const collection = engine.selection.collection.clone();

  // Get only the nodes that can actually be duplicated. This MUST be the first
  // thing that we do right after cloning the selection because later on we
  // might have to deal with groups. The thing with groups is that their "Start"
  // and "End" nodes are not duplicable per-se, but they still can get
  // duplicated if we're copying the entire group.
  collection.reset(
    collection.filter(node => node.prop("duplicable"))
  );

  if(!collection.length) return;

  keyboard.clipboard.copy(collection, engine.model);
}
