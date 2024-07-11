import { util } from "@joint/core";

import { OneInZeroOut } from "./OneInZeroOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { HaltStatic, HaltFns } from "@src/components/implementations/executionControl/Halt";

export class Halt extends OneInZeroOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.Halt",
      ...HaltStatic,
    });
  }
}
extendFns(Halt, HaltFns);
