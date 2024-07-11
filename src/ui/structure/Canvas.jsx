import { get } from "lodash-es";
import { useDrop } from "react-dnd";
import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";
import { EventBus } from "@src/core/EventBus";

export const Canvas = (props) => {
  const runtime = new Runtime();
  const gconfig = new GConfig();
  const eventBus = new EventBus();

  const [, drop] = useDrop(
    () => ({
      accept: "ddWidget",
      drop: (item, monitor) => {
        if(!item) return;

        // The "onMouseLeave" of the actionGroup won't get triggered until the
        // cursor has **moved** **after** dropping the action. This means that
        // the actionGroup menu will keep being visible even if it was opened
        // by a "hover" state. Not good.
        // Workaround the browser behavior by sending an event to the
        // actionGroup and let it decide if it should close itself.
        // PD: You might not like this, but this is peak engineering so stfu.
        eventBus.publish("CanvasDrop");

        const engine = runtime.get("objects.engine");
        const model = runtime.get("objects.main_model");
        const cm = runtime.get("objects.commandManager");

        let { x, y } = monitor.getClientOffset();
        const shapes = runtime.get("objects.shapes");
        const orientation = gconfig.get("ui.shapes.orientation");
        const shapeCls = get({ shapes }, item.shape[orientation]);
        const node = new shapeCls();

        const { width, height } = node.getBBox();
        ({ x, y } = engine.clientToLocalPoint({ x, y }));
        node.position(x - width / 2, y - height / 2);

        // Add default settings
        node.enforceSettingsStructure();

        // Start a batch operation.
        cm.initBatchCommand();

        model.addCell(node);

        // Deselect all selected elements in order to avoid the creation of a
        // group with unexpected elements inside it.
        engine.selection.collection.reset([]);

        // Simulate element_pointerup event. We want to do this because the
        // entire "grouping" logic is triggered on this event.
        const view = node.findView(engine);
        const p = node.getBBox().center();
        view.pointerup({}, p.x, p.y);

        // End the batch operation
        cm.storeBatchCommand();
      },
    }),
  );

  return (
    <div className="blueprint-container" ref={drop}>
      <div id="canvas" className="canvas w-100 h-100"></div>
    </div>
  )
}
