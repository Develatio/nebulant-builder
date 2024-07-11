import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindFirewallStatic, FindFirewallFns
} from "@src/components/implementations/hetznerCloud/FindFirewall";

export class FindFirewall extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindFirewall",
      ...FindFirewallStatic,
    });
  }
}
extendFns(FindFirewall, FindFirewallFns);
