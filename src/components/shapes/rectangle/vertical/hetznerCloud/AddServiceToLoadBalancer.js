import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  AddServiceToLoadBalancerStatic, AddServiceToLoadBalancerFns
} from "@src/components/implementations/hetznerCloud/AddServiceToLoadBalancer";

export class AddServiceToLoadBalancer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.AddServiceToLoadBalancer",
      ...AddServiceToLoadBalancerStatic,
    });
  }
}
extendFns(AddServiceToLoadBalancer, AddServiceToLoadBalancerFns);
