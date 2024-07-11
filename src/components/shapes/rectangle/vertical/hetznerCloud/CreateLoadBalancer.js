import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateLoadBalancerStatic, CreateLoadBalancerFns
} from "@src/components/implementations/hetznerCloud/CreateLoadBalancer";

export class CreateLoadBalancer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateLoadBalancer",
      ...CreateLoadBalancerStatic,
    });
  }
}
extendFns(CreateLoadBalancer, CreateLoadBalancerFns);
