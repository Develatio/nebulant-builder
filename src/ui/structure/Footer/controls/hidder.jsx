import { useState, useEffect } from "react";

import { GConfig } from "@src/core/GConfig";

import DoubleArrrowUpIcon from "@src/assets/img/icons/control/double-arrow-up.svg?transform";
import DoubleArrrowDownIcon from "@src/assets/img/icons/control/double-arrow-down.svg?transform";

const BLINK_NONE = 0;
const BLINK_WARN = 1;
const BLINK_ERR = 2;

export const Hidder = () => {
  const gconfig = new GConfig();

  const [blink, setBlinking] = useState(BLINK_NONE);
  const [visible, setVisibility] = useState(gconfig.get("ui.panels.footer.visible"));

  useEffect(() => {
    gconfig.notifyOnChanges("ui.panels.footer.visible", setVisibility);

    return () => {
      gconfig.stopNotifying("ui.panels.footer.visible", setVisibility);
    };
  }, []);

  // Blinking / visual alerts

  // Stop blinking after a few seconds...
  useEffect(() => {
    setBlinking(blink => {
      if(blink > 0) {
        setTimeout(() => setBlinking(BLINK_NONE), 3000);
      }

      return blink;
    });
  }, [blink]);

  // ... or when the log viewer get's opened
  useEffect(() => {
    if(visible) {
      setBlinking(BLINK_NONE);
    }

    // TODO: Do we want to clear the logger.filteredMsgs when "!visible" and
    // call logger.updateLogView() when "visible"?
  }, [visible]);

  return (
    <div className={`
      hidder
      ${visible ? "expanded" : ""}
      ${blink == BLINK_WARN ? "blink-warning" : "" }
      ${blink == BLINK_ERR ? "blink-error" : "" }
    `}>
      <div className="px-3 py-0" onClick={() => gconfig.set("ui.panels.footer.visible", !visible)}>
        { visible ?
          <DoubleArrrowDownIcon className="double-arrow-down" /> :
          <DoubleArrrowUpIcon className="double-arrow-up" />
        }
      </div>
    </div>
  );
}
