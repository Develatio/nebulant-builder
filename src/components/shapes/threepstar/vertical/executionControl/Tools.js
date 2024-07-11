import { RemoveButton as RemoveButtonBase } from "@src/components/shapes/tools/RemoveButton";
import { SettingsButton as SettingsButtonBase } from "@src/components/shapes/tools/SettingsButton";

export const RemoveButton = RemoveButtonBase.extend({
  attributes: {
    class: "executionControl",
  },
});

export const SettingsButton = SettingsButtonBase.extend({
  attributes: {
    class: "executionControl",
  },
});
