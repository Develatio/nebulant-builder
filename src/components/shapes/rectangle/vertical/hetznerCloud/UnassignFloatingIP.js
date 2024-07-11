import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  UnassignFloatingIPStatic, UnassignFloatingIPFns
} from "@src/components/implementations/hetznerCloud/UnassignFloatingIP";

export class UnassignFloatingIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.UnassignFloatingIP",
      ...UnassignFloatingIPStatic,
    });
  }
}
extendFns(UnassignFloatingIP, UnassignFloatingIPFns);
