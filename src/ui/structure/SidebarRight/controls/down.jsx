import { EventBus } from "@src/core/EventBus";

import { Tooltip } from "@src/ui/functionality/Tooltip";

import MagPlusIcon from "@src/assets/img/icons/control/mag-plus.svg?transform";
import MagMinusIcon from "@src/assets/img/icons/control/mag-minus.svg?transform";

export const Down = () => {
  const eventBus = new EventBus();

  return (
    <div className="zoomControls d-flex flex-row">
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
  );
}
