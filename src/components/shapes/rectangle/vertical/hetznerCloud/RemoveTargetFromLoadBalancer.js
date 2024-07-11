import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  RemoveTargetFromLoadBalancerStatic, RemoveTargetFromLoadBalancerFns
} from "@src/components/implementations/hetznerCloud/RemoveTargetFromLoadBalancer";

export class RemoveTargetFromLoadBalancer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.RemoveTargetFromLoadBalancer",
      ...RemoveTargetFromLoadBalancerStatic,
    });
  }
}
extendFns(RemoveTargetFromLoadBalancer, RemoveTargetFromLoadBalancerFns);
