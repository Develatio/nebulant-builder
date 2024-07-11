import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindPrimaryIPsStatic, FindPrimaryIPsFns,
} from "@src/components/implementations/hetznerCloud/FindPrimaryIPs";

export class FindPrimaryIPs extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindPrimaryIPs",
      ...FindPrimaryIPsStatic,
    });
  }
}
extendFns(FindPrimaryIPs, FindPrimaryIPsFns);
