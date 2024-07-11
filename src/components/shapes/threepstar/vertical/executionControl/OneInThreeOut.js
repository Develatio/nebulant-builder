import { util } from "@joint/core";

import { Errors } from "@src/components/shapes/tools/Errors";
import { Warnings } from "@src/components/shapes/tools/Warnings";
import {
  OneInThreeOut as BaseOneInThreeOut
} from "@src/components/shapes/threepstar/vertical/base/OneInThreeOut";

import { RemoveButton } from "./Tools";
import { SettingsButton } from "./Tools";
import { Highlighter } from "./Highlighter";

export class OneInThreeOut extends BaseOneInThreeOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.threepstar.vertical.executionControl.OneInThreeOut",

      title: "Exec control",
      label: "Execution control base",
      highlighter: Highlighter,
      cellTools: [
        RemoveButton,
        SettingsButton,
      ],
      errorsTool: Errors,
      warningsTool: Warnings,
    });
  }
}
