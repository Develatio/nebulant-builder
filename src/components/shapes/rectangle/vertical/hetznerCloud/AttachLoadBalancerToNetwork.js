import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  AttachLoadBalancerToNetworkStatic, AttachLoadBalancerToNetworkFns
} from "@src/components/implementations/hetznerCloud/AttachLoadBalancerToNetwork";

export class AttachLoadBalancerToNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.AttachLoadBalancerToNetwork",
      ...AttachLoadBalancerToNetworkStatic,
    });
  }
}
extendFns(AttachLoadBalancerToNetwork, AttachLoadBalancerToNetworkFns);
