import { useState } from "react";

import { Runtime } from "@src/core/Runtime";
import { GConfig } from "@src/core/GConfig";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import MagPlusIcon from "@src/assets/img/icons/control/mag-plus.svg?transform";
import MagMinusIcon from "@src/assets/img/icons/control/mag-minus.svg?transform";

export const Up = () => {
  const runtime = new Runtime();
  const gconfig = new GConfig();

  const engine = runtime.get("objects.engine");

  const [minimap, _] = useState(gconfig.get("ui.minimap"));

  return (
    <div className="actions up">
      {
        minimap ? (
          <div className="minimap-wrapper">
            <div className="minimap-container">
              {
                !minimap && engine.hasEngineLayers() ? (
                  <Tooltip
                    placement="left"
                    label={<>Current layer</>}
                  >
                    <div className="minimap-placeholder"></div>
                  </Tooltip>
                ) : ""
              }
            </div>
          </div>
        ) : ""
      }

      <div className="zoomControls">
        <div className="me-1 mag-minus" onClick={() => eventBus.publish("ZoomOut")}>
          <Tooltip
            placement="left"
            label={<>Zoom out the blueprint canvas (<kbd>ctrl + -</kbd>)</>}
          >
            <div>
              <MagMinusIcon />
            </div>
          </Tooltip>
        </div>
        <div className="mag-plus" onClick={() => eventBus.publish("ZoomIn")}>
          <Tooltip
            placement="left"
            label={<>Zoom in the blueprint canvas (<kbd>ctrl + +</kbd>)</>}
          >
            <div>
              <MagPlusIcon />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
