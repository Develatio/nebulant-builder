import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindLoadBalancerStatic, FindLoadBalancerFns
} from "@src/components/implementations/hetznerCloud/FindLoadBalancer";

export class FindLoadBalancer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindLoadBalancer",
      ...FindLoadBalancerStatic,
    });
  }
}
extendFns(FindLoadBalancer, FindLoadBalancerFns);
