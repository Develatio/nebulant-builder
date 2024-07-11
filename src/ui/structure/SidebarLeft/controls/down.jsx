import { useEffect, useState } from "react";

import { Runtime } from "@src/core/Runtime";
import { EventBus } from "@src/core/EventBus";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import InfoIcon from "@src/assets/img/icons/control/info.svg?transform";

import UndoIcon from "@src/assets/img/icons/control/undo.svg?transform";
import RedoIcon from "@src/assets/img/icons/control/redo.svg?transform";

export const Down = () => {
  const runtime = new Runtime();
  const eventBus = new EventBus();

  const [hasUndo, setHasUndo] = useState(false);
  const [hasRedo, setHasRedo] = useState(false);

  useEffect(() => {
    const updateCM = () => {
      const cm = runtime.get("objects.commandManager");
      setHasUndo(cm.hasUndo());
      setHasRedo(cm.hasRedo());
    }

    runtime.notifyOnChanges("state.ops_counter", updateCM);

    return () => {
      runtime.stopNotifying("state.ops_counter", updateCM);
    }
  }, []);

  return (
    <div className="actions down d-flex flex-row">
      <div className="infoControl">
        <div className="info" onClick={() => eventBus.publish("ToggleInfo")}>
          <Tooltip
            placement="right"
            label={<>Toggle comments (<kbd>ctrl + i</kbd>)</>}
          >
            <div>
              <InfoIcon />
            </div>
          </Tooltip>
        </div>
      </div>

      <div
        className={`me-1 undo ${hasUndo ? "hasUndo" : "noUndo"}`}
        onClick={() => eventBus.publish("UndoAction")}
      >
        <Tooltip
          placement="right"
          label={<>Undo the last change in the blueprint (<kbd>ctrl + z</kbd>)</>}
        >
          <div>
            <UndoIcon />
          </div>
        </Tooltip>
      </div>

      <div
        className={`redo ${hasRedo ? "hasRedo" : "noRedo"}`}
        onClick={() => eventBus.publish("RedoAction")}
      >
        <Tooltip
          placement="right"
          label={<>Redo the last change in the blueprint (<kbd>ctrl + y</kbd>)</>}
        >
          <div>
            <RedoIcon />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
