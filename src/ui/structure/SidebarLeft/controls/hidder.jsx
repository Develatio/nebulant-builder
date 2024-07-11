import { GConfig } from "@src/core/GConfig";

import DoubleArrrowLeftIcon from "@src/assets/img/icons/control/double-arrow-left.svg?transform";
import DoubleArrrowRightIcon from "@src/assets/img/icons/control/double-arrow-right.svg?transform";

export const Hidder = () => {
  const gconfig = new GConfig();
  const cur = gconfig.get("ui.panels.sidebarLeft.visible");

  return (
    <div className="hidder">
      <div className="p-1" onClick={() => gconfig.set("ui.panels.sidebarLeft.visible", !cur)}>
        { cur ? (
          <DoubleArrrowLeftIcon className="double-arrow-left" />
        ) : (
          <DoubleArrrowRightIcon className="double-arrow-right" />
        )}
      </div>
    </div>
  );
}
