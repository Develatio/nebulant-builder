import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";

import {
  importAsGroup,
  importAsBlueprint,
} from "@src/controllers/handlers/import";
import { Logger } from "@src/core/Logger";
import { EventBus } from "@src/core/EventBus";
import { loadFile } from "@src/controllers/handlers/import";

const logger = new Logger();
const eventBus = new EventBus();

const fhandler = async (files, { x, y }) => {
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
  } else {
    // Check if this blueprint is actually importable as group. If it isn't,
    // then just import it as a normal blueprint, overwriting the current
    // one.
    const startNode = data?.blueprint?.diagram?.cells?.find?.(
      c => c.type.endsWith(".executionControl.Start") && !c.parent
    );
    if(!startNode?.data?.settings?.parameters?.group_settings_enabled) {
      logger.debug("This looks like a plain blueprint. Importing it...");
      importAsBlueprint(data);
      return;
    }

    logger.debug("It looks like this blueprint can be imported either as a blueprint or as a group! Let's ask the user...");

    // Ask the user if he/she wants to load this blueprint as a group into
    // the current blueprint or as a new blueprint.
    eventBus.publish("OpenDialog", {
      title: "How do you want to import this file?",
      enforceAnswer: true,
      body: (
        <div>
          This file can be imported as a group or as a new blueprint, overriding
          the current blueprint.
          <br />
          How do you want to import it?
        </div>
      ),
      yeslabel: "As a blueprint",
      yes: () => importAsBlueprint(data),
      nolabel: "As a group",
      no: () => importAsGroup(data, { x, y }),
      close: () => {},
    });
  }
}

export const FileDnD = (props) => {
  const { children } = props;

  const [{ _canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item, monitor) {
        if(!item) return;

        const { x, y } = monitor.getClientOffset();
        fhandler(item.files, { clientX: x, clientY: y });
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
