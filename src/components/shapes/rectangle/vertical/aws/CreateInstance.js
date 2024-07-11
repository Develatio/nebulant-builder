import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { CreateInstanceStatic, CreateInstanceFns } from "@src/components/implementations/aws/CreateInstance";

export class CreateInstance extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.CreateInstance",
      ...CreateInstanceStatic,
    });
  }
}
extendFns(CreateInstance, CreateInstanceFns);
