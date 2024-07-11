import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindLoadBalancersStatic, FindLoadBalancersFns,
} from "@src/components/implementations/hetznerCloud/FindLoadBalancers";

export class FindLoadBalancers extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindLoadBalancers",
      ...FindLoadBalancersStatic,
    });
  }
}
extendFns(FindLoadBalancers, FindLoadBalancersFns);
