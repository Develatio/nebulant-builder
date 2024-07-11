import { util } from "@joint/core";

import { OneInOneOut } from "./OneInOneOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { SleepStatic, SleepFns } from "@src/components/implementations/executionControl/Sleep";

export class Sleep extends OneInOneOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.Sleep",
      ...SleepStatic,
    });
  }
}
extendFns(Sleep, SleepFns);
