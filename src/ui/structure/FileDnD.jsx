import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import { Logger } from "@src/core/Logger";
import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";
import { loadFile, importWizard } from "@src/controllers/handlers/import";

const fhandler = async (files, { x, y }) => {
  const logger = new Logger();
  const eventBus = new EventBus();

  logger.debug(`Received ${files.length} file(s) from a D&D event`);
  Array.from(files).map(f => logger.debug(`\t-> ${f.name}`));

  if(files.length !== 1 || !files[0].name.endsWith(".nbp")) {
    eventBus.publish("OpenDialog", {
      title: "Import error",
      body: (
        <div className="h6 callout callout-danger">
          This is not a Nebulant blueprint file.
          <br />
          Please make sure that you're importing a Nebulant blueprint.
        </div>
      ),
    });
    return;
  }

  const data = await loadFile(files[0]);

  if(data === null) {
    eventBus.publish("OpenDialog", {
      title: "Import error",
      body: (
        <div className="h6 callout callout-danger">
          Unexpected error while trying to parse the blueprint.
          <br />
          Please make sure that you're importing a Nebulant blueprint.
        </div>
      ),
    });

    return;
  }

  importWizard(data, { x, y });
}

export const FileDnD = (props) => {
  const { children } = props;

  const runtime = new Runtime();

  const [{ _canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item, monitor) {
        if(!item) return;

        const { x, y } = monitor.getClientOffset();
        const engine = runtime.get("objects.engine");
        const p = engine.clientToLocalPoint({ x, y });
        fhandler(item.files, p);
      },
      collect: (monitor) => {
        //const item = monitor.getItem()
        //if (item) {
        //  console.log('collect', item.files, item.items)
        //}
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }
      },
    }),
    [],
  )

  return (
    <div className="file-drop" ref={drop}>
      <div className="file-drop-target">
        {
          isOver ? (
            <div className="filedrop-notificator">
              <div className="wrapper">
                <h1>Drop your .nbp file here</h1>
              </div>
            </div>
          ) : ""
        }

        {children}
      </div>
    </div>
  );
}
