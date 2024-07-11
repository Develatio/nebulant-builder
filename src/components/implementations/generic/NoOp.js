import {
  SettingsButton,
} from "@src/components/shapes/rectangle/vertical/generic/Tools";

import NoOpIcon from "@src/assets/img/icons/generic/no-op.svg";

export const NoOpStatic = {
  label: "No op",
  icon: NoOpIcon,

  configurable: false,

  data: {
    id: "no-op",
    version: "1.0.0",
    provider: "generic",
  },
};

export const NoOpFns = {
  init() {
    // We don't want the "SettingsButton" tool in this cell
    this.prop("cellTools", this.prop("cellTools").filter(t => t != SettingsButton), {
      rewrite: true, // don't merge, instead overwrite everything
      skip_undo_stack: true, // we don't want to cause undo/redo noise
    });
  }
};
