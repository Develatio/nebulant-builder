import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteFirewallStatic, DeleteFirewallFns
} from "@src/components/implementations/hetznerCloud/DeleteFirewall";

export class DeleteFirewall extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteFirewall",
      ...DeleteFirewallStatic,
    });
  }
}
extendFns(DeleteFirewall, DeleteFirewallFns);
