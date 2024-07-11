import { util } from "@joint/core";

import {
  OneInOneOut as BaseOneInOneOut
} from "@src/components/shapes/rectangle/vertical/base/OneInOneOut";

import { RemoveButton } from "./Tools";
import { SettingsButton } from "./Tools";
import { Highlighter } from "./Highlighter";

export class OneInOneOut extends BaseOneInOneOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.OneInOneOut",

      title: "Generic",
      highlighter: Highlighter,
      cellTools: [
        RemoveButton,
        SettingsButton,
      ],
    });
  }
}
