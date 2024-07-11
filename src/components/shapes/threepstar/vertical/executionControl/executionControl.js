import { util } from "@joint/core";

import { OneInThreeOut } from "./OneInThreeOut";

import { ConditionStatic, ConditionFns } from "@src/components/implementations/executionControl/Condition";

export class Condition extends OneInThreeOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.threepstar.vertical.executionControl.Condition",
      ...ConditionStatic,
    });
  }
}
Object.entries(ConditionFns).forEach(([key, fn]) => Condition.prototype[key] = fn);
