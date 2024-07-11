import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  ApplyFirewallToResourceStatic, ApplyFirewallToResourceFns
} from "@src/components/implementations/hetznerCloud/ApplyFirewallToResource";

export class ApplyFirewallToResource extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.ApplyFirewallToResource",
      ...ApplyFirewallToResourceStatic,
    });
  }
}
extendFns(ApplyFirewallToResource, ApplyFirewallToResourceFns);
