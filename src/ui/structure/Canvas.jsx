import { get } from "lodash-es";
import { useDrop } from "react-dnd";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";
import { content_path_builder } from "@src/utils/content_path_builder";
import { loadContent, importWizard } from "@src/controllers/handlers/import";

const handleMarketplaceWidgetDrop = async ({ x, y, item }) => {
  const eventBus = new EventBus();

  const blueprint_uri = content_path_builder({
    organization_slug: item.organization_slug,
    collection_slug: item.collection_slug,
    blueprint_slug: item.slug,
    version: item.latest_stable || item.latest || item.latest_beta,
  });

  eventBus.publish("OpenOverlay", {
    message: "Please wait...",
  });

  const data = await loadContent(blueprint_uri);

  eventBus.publish("CloseOverlay");

  importWizard(data, { x, y });
}

const handleWidgetDrop = ({ x, y, item }) => {
  const runtime = new Runtime();
  const gconfig = new GConfig();

  const engine = runtime.get("objects.engine");
  const model = runtime.get("objects.main_model");
  const cm = runtime.get("objects.commandManager");

  const shapes = runtime.get("objects.shapes");
  const orientation = gconfig.get("ui.shapes.orientation");
  const shapeCls = get({ shapes }, item.shape[orientation]);
  const node = new shapeCls();

  const { width, height } = node.getBBox();
  node.position(x - width / 2, y - height / 2);

  // Add default settings
  node.enforceSettingsStructure();

  // Start a batch operation.
  cm.initBatchCommand();

  model.addCell(node);

  // Deselect all selected elements in order to avoid the creation of a group
  // with unexpected elements inside it.
  engine.selection.collection.reset([]);

  // Simulate element_pointerup event. We want to do this because the entire
  // "grouping" logic is triggered on this event.
  const view = node.findView(engine);
  const p = node.getBBox().center();
  view.pointerup({}, p.x, p.y);

  // End the batch operation
  cm.storeBatchCommand();
}

const handleDrop = (item, monitor) => {
  if(!item) return;

  const runtime = new Runtime();
  const eventBus = new EventBus();

  // The "onMouseLeave" of the actionGroup won't get triggered until the cursor
  // has **moved** **after** dropping the action. This means that the
  // actionGroup menu will keep being visible even if it was opened by a "hover"
  // state. Not good.
  // Workaround the browser behavior by sending an event to the actionGroup and
  // let it decide if it should close itself.
  // PD: You might not like this, but this is peak engineering so stfu.
  eventBus.publish("CanvasDrop");

  const engine = runtime.get("objects.engine");

  let { x, y } = monitor.getClientOffset();
  ({ x, y } = engine.clientToLocalPoint({ x, y }));

  const type = monitor.getItemType();
  if(type == "ddWidget") {
    handleWidgetDrop({ x, y, item });
  } else if(type == "ddMarketplaceWidget") {
    handleMarketplaceWidgetDrop({ x, y, item });
  }
}

export const Canvas = (props) => {
  const [{}, drop] = useDrop(
    () => ({
      accept: ["ddWidget", "ddMarketplaceWidget"],
      collect: (monitor) => ({
        itemType: monitor.getItemType(),
      }),
      drop: handleDrop,
    }),
  );

  return (
    <div className="blueprint-container" ref={drop}>
      <div id="canvas" className="canvas w-100 h-100"></div>
    </div>
  )
}
