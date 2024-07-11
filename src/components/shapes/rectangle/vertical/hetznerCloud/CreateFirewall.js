import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateFirewallStatic, CreateFirewallFns
} from "@src/components/implementations/hetznerCloud/CreateFirewall";

export class CreateFirewall extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateFirewall",
      ...CreateFirewallStatic,
    });
  }
}
extendFns(CreateFirewall, CreateFirewallFns);
