import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindFloatingIPsStatic, FindFloatingIPsFns,
} from "@src/components/implementations/hetznerCloud/FindFloatingIPs";

export class FindFloatingIPs extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindFloatingIPs",
      ...FindFloatingIPsStatic,
    });
  }
}
extendFns(FindFloatingIPs, FindFloatingIPsFns);
