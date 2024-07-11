import { RemoveButton as RemoveButtonBase } from "@src/components/shapes/tools/RemoveButton";
import { SettingsButton as SettingsButtonBase } from "@src/components/shapes/tools/SettingsButton";
import { FindAutocompletePath as FindAutocompletePathBase } from "@src/components/shapes/tools/FindAutocompletePath";

export const RemoveButton = RemoveButtonBase.extend({
  attributes: {
    class: "hetznerCloud",
  },
});

export const SettingsButton = SettingsButtonBase.extend({
  attributes: {
    class: "hetznerCloud",
  },
});

export const FindAutocompletePath = FindAutocompletePathBase.extend({
  attributes: {
    class: "hetznerCloud",
  },
});
