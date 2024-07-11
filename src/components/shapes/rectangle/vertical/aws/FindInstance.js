import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindInstanceStatic, FindInstanceFns,
} from "@src/components/implementations/aws/FindInstance";

export class FindInstance extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindInstance",
      ...FindInstanceStatic,
    });
  }
}
extendFns(FindInstance, FindInstanceFns);
