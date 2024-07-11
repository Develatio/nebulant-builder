import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindFirewallsStatic, FindFirewallsFns,
} from "@src/components/implementations/hetznerCloud/FindFirewalls";

export class FindFirewalls extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindFirewalls",
      ...FindFirewallsStatic,
    });
  }
}
extendFns(FindFirewalls, FindFirewallsFns);
