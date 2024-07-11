import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindFloatingIPStatic, FindFloatingIPFns
} from "@src/components/implementations/hetznerCloud/FindFloatingIP";

export class FindFloatingIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindFloatingIP",
      ...FindFloatingIPStatic,
    });
  }
}
extendFns(FindFloatingIP, FindFloatingIPFns);
