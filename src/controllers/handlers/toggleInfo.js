import { GConfig } from "@src/core/GConfig";

export const toggleInfo = () => {
  const gconfig = new GConfig();

  const v = gconfig.get("ui.showInfo");
  gconfig.set("ui.showInfo", !v);
}
