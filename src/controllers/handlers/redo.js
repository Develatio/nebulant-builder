import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

export const redo = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const eventBus = new EventBus();
  const commandManager = runtime.get("objects.commandManager");

  logger.debug("Redoing action...");

  if(commandManager.hasRedo()) {
    commandManager.redo();

    const ops_counter = runtime.get("state.ops_counter");
    if(ops_counter != undefined) {
      runtime.set("state.ops_counter", ops_counter + 1);
    }

    eventBus.publish("BlueprintChange");
  }
}
