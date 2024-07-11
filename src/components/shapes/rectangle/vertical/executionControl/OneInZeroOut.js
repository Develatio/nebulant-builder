import { util } from "@joint/core";

import {
  OneInZeroOut as BaseOneInZeroOut
} from "@src/components/shapes/rectangle/vertical/base/OneInZeroOut";

import { RemoveButton } from "./Tools";
import { SettingsButton } from "./Tools";
import { Highlighter } from "./Highlighter";

export class OneInZeroOut extends BaseOneInZeroOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.OneInZeroOut",

      title: "Exec control",
      highlighter: Highlighter,
      cellTools: [
        RemoveButton,
        SettingsButton,
      ],
    });
  }
}
