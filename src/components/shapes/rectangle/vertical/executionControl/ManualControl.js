import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { ManualControlStatic, ManualControlFns } from "@src/components/implementations/executionControl/ManualControl";

export class ManualControl extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.ManualControl",
      ...ManualControlStatic,
    });
  }
}
extendFns(ManualControl, ManualControlFns);
