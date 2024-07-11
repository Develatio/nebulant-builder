import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  UnassignPrimaryIPStatic, UnassignPrimaryIPFns
} from "@src/components/implementations/hetznerCloud/UnassignPrimaryIP";

export class UnassignPrimaryIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.UnassignPrimaryIP",
      ...UnassignPrimaryIPStatic,
    });
  }
}
extendFns(UnassignPrimaryIP, UnassignPrimaryIPFns);
