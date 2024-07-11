import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  AddTargetToLoadBalancerStatic, AddTargetToLoadBalancerFns
} from "@src/components/implementations/hetznerCloud/AddTargetToLoadBalancer";

export class AddTargetToLoadBalancer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.AddTargetToLoadBalancer",
      ...AddTargetToLoadBalancerStatic,
    });
  }
}
extendFns(AddTargetToLoadBalancer, AddTargetToLoadBalancerFns);
