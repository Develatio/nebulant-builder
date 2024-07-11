import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  RemoveServiceFromLoadBalancerStatic, RemoveServiceFromLoadBalancerFns
} from "@src/components/implementations/hetznerCloud/RemoveServiceFromLoadBalancer";

export class RemoveServiceFromLoadBalancer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.RemoveServiceFromLoadBalancer",
      ...RemoveServiceFromLoadBalancerStatic,
    });
  }
}
extendFns(RemoveServiceFromLoadBalancer, RemoveServiceFromLoadBalancerFns);
