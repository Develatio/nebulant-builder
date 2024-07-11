import { util } from "@joint/core";

import {
  OneInTwoOut as BaseOneInTwoOut
} from "@src/components/shapes/rectangle/vertical/base/OneInTwoOut";

import { RemoveButton } from "./Tools";
import { SettingsButton } from "./Tools";
import { Highlighter } from "./Highlighter";

export class OneInTwoOut extends BaseOneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.OneInTwoOut",

      title: "AWS",

      highlighter: Highlighter,
      cellTools: [
        RemoveButton,
        SettingsButton,
      ],
    });
  }
}
