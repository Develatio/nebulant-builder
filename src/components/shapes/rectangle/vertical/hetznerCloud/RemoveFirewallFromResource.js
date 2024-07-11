import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  RemoveFirewallFromResourceStatic, RemoveFirewallFromResourceFns
} from "@src/components/implementations/hetznerCloud/RemoveFirewallFromResource";

export class RemoveFirewallFromResource extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.RemoveFirewallFromResource",
      ...RemoveFirewallFromResourceStatic,
    });
  }
}
extendFns(RemoveFirewallFromResource, RemoveFirewallFromResourceFns);
