import { useState, useEffect } from "react";

import { GConfig } from "@src/core/GConfig";

import { Up } from "@src/ui/structure/SidebarRight/controls/up";
import { Hidder } from "@src/ui/structure/SidebarRight/controls/hidder";
import { Down } from "@src/ui/structure/SidebarRight/controls/down";
import { Variables } from "@src/ui/structure/SidebarRight/variables";

export const SidebarRight = (_props) => {
  const gconfig = new GConfig();

  const [visibility, setVisibility] = useState(gconfig.get("ui.panels.sidebarRight.visible"));

  useEffect(() => {
    gconfig.notifyOnChanges("ui.panels.sidebarRight.visible", setVisibility);

    return () => {
      gconfig.stopNotifying("ui.panels.sidebarRight.visible", setVisibility);
    };
  }, []);

  return (
    <div className={`application-right-side d-flex flex-column ${visibility ? "visible" : "hidden"}`}>

      {/* Sidebar actions */}
      <Up />
      <Hidder />
      <Down />

      {/* The actual sidebar */}
      <Variables />
    </div>
  );
}
