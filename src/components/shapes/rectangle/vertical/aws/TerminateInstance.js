import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  TerminateInstanceStatic, TerminateInstanceFns,
  TerminateInstancesStatic
} from "@src/components/implementations/aws/TerminateInstance";

export class TerminateInstance extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.TerminateInstance",
      ...TerminateInstanceStatic,
    });
  }
}
extendFns(TerminateInstance, TerminateInstanceFns);

export class TerminateInstances extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.TerminateInstances",
      ...TerminateInstancesStatic,
    });
  }
}
extendFns(TerminateInstances, TerminateInstanceFns);
