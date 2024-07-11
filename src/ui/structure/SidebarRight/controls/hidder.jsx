import { useState, useEffect } from "react";

import { GConfig } from "@src/core/GConfig";

import DoubleArrrowLeftIcon from "@src/assets/img/icons/control/double-arrow-left.svg?transform";
import DoubleArrrowRightIcon from "@src/assets/img/icons/control/double-arrow-right.svg?transform";

export const Hidder = () => {
  const gconfig = new GConfig();

  const [visibility, setVisibility] = useState(gconfig.get("ui.panels.sidebarRight.visible"));

  useEffect(() => {
    gconfig.notifyOnChanges("ui.panels.sidebarRight.visible", setVisibility);

    return () => {
      gconfig.stopNotifying("ui.panels.sidebarRight.visible", setVisibility);
    };
  }, []);

  return (
    <div className="hidder">
      <div
        className="p-1"
        onClick={() => gconfig.set("ui.panels.sidebarRight.visible", !visibility)}
      >
        {
          visibility ? (
            <DoubleArrrowRightIcon className="double-arrow-right" />
          ) : (
            <DoubleArrrowLeftIcon className="double-arrow-left" />
          )
        }
      </div>
    </div>
  );
}
