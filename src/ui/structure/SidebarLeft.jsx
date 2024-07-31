import { useState, useEffect } from "react";

import { GConfig } from "@src/core/GConfig";

import { Up } from "@src/ui/structure/SidebarLeft/controls/up";
import { Hidder } from "@src/ui/structure/SidebarLeft/controls/hidder";
import { Down } from "@src/ui/structure/SidebarLeft/controls/down";

import { Actions } from "@src/ui/structure/SidebarLeft/actions";
import { Providers } from "@src/ui/structure/SidebarLeft/providers";
import { Marketplace } from "@src/ui/structure/SidebarLeft/marketplace";
import { MarketplaceFilters } from "@src/ui/structure/SidebarLeft/marketplaceFilters";

export const SidebarLeft = () => {
  const gconfig = new GConfig();

  const [
    visible,
    setVisible
  ] = useState(gconfig.get("ui.panels.sidebarLeft.visible"));

  const [tab, setTab] = useState("actionsTab");

  useEffect(() => {
    gconfig.notifyOnChanges("ui.panels.sidebarLeft.visible", setVisible);

    return () => {
      gconfig.stopNotifying("ui.panels.sidebarLeft.visible", setVisible);
    }
  });

  return (
    <div className={`application-left-side d-flex flex-column ${visible ? "visible" : "hidden"}`}>

      {/* Sidebar actions */}
      <Up />
      <Hidder />
      <Down />

      {/* The actual sidebar */}
      <div className="header w-100">
        <span
          className={`${tab === "actionsTab" ? "active" : ""}`}
          onClick={() => setTab("actionsTab")}
        >Actions</span>
        <span
          className={`${tab === "marketplaceTab" ? "active" : ""}`}
          onClick={() => setTab("marketplaceTab")}
        >Marketplace</span>
      </div>

      {
        tab === "actionsTab" ? (
          <div className="ddWidgets-wrapper d-flex w-100">
            <Providers />

            <Actions />
          </div>
        ) : (
          <div className="marketplace-wrapper d-flex w-100">
            <MarketplaceFilters />

            <Marketplace />
          </div>
        )
      }
    </div>
  );
}
