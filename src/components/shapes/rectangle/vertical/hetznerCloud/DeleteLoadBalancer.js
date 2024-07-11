import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteLoadBalancerStatic, DeleteLoadBalancerFns
} from "@src/components/implementations/hetznerCloud/DeleteLoadBalancer";

export class DeleteLoadBalancer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteLoadBalancer",
      ...DeleteLoadBalancerStatic,
    });
  }
}
extendFns(DeleteLoadBalancer, DeleteLoadBalancerFns);
