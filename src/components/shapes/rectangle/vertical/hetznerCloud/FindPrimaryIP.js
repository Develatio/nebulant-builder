import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindPrimaryIPStatic, FindPrimaryIPFns
} from "@src/components/implementations/hetznerCloud/FindPrimaryIP";

export class FindPrimaryIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindPrimaryIP",
      ...FindPrimaryIPStatic,
    });
  }
}
extendFns(FindPrimaryIP, FindPrimaryIPFns);
