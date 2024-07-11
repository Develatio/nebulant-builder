import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindInstancesStatic, FindInstancesFns,
} from "@src/components/implementations/aws/FindInstances";

export class FindInstances extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindInstances",
      ...FindInstancesStatic,
    });
  }
}
extendFns(FindInstances, FindInstancesFns);
