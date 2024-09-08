import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";

export const paste = () => {
  const logger = new Logger();
  const runtime = new Runtime();
  const engine = runtime.get("objects.engine");
  const keyboard = runtime.get("objects.keyboard");

  // Paste the content of the cliboard
  logger.debug("Pasteing clipboard contents...");
  let elements = keyboard.clipboard.paste(engine.model);

  // Remove links that are linked to cells that weren't copied
  const nodes = elements.map(
    element => element.isLink() ? null : element
  ).filter(node => node);
  const ids = nodes.map(node => node.id);

  elements.forEach(element => {
    if(element.isLink()) {
      const source = element.getSourceCell()?.id;
      const target = element.getTargetCell()?.id;
      if(!ids.includes(source) || !ids.includes(target)) {
        element.remove();
      }
    }
  });

  // Unselect current selection and select newly pasted elements
  engine.selection.collection.reset(nodes);

  // Add the "top level" elements to the current layer (if any)
  if(engine.hasEngineLayers()) {
    const group = engine.getCurrentEngineLayer();
    const topLevelNodes = elements.filter(
      el => !el.isLink() && !ids.includes(el.parent())
    );
    group.addToGroup(topLevelNodes);
  }
}
