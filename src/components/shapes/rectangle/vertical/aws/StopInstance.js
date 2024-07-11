import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { StopInstanceStatic, StopInstanceFns } from "@src/components/implementations/aws/StopInstance";

export class StopInstance extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.StopInstance",
      ...StopInstanceStatic,
    });
  }
}
extendFns(StopInstance, StopInstanceFns);
