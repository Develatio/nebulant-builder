import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { StartInstanceStatic, StartInstanceFns } from "@src/components/implementations/aws/StartInstance";

export class StartInstance extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.StartInstance",
      ...StartInstanceStatic,
    });
  }
}
extendFns(StartInstance, StartInstanceFns);
