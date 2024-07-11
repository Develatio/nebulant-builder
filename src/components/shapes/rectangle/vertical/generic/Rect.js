import { util } from "@joint/core";

import {
  Rect as BaseRect
} from "@src/components/shapes/rectangle/vertical/base/Rect";

import { RemoveButton } from "./Tools";
import { SettingsButton } from "./Tools";
import { Highlighter } from "./Highlighter";

export class Rect extends BaseRect {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.Rect",

      label: "Generic base",
      highlighter: Highlighter,
      cellTools: [
        RemoveButton,
        SettingsButton,
      ],
    });
  }
}
