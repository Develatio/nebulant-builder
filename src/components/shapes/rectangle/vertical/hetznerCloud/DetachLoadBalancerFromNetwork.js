import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DetachLoadBalancerFromNetworkStatic, DetachLoadBalancerFromNetworkFns
} from "@src/components/implementations/hetznerCloud/DetachLoadBalancerFromNetwork";

export class DetachLoadBalancerFromNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DetachLoadBalancerFromNetwork",
      ...DetachLoadBalancerFromNetworkStatic,
    });
  }
}
extendFns(DetachLoadBalancerFromNetwork, DetachLoadBalancerFromNetworkFns);
