import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  AssignPrimaryIPStatic, AssignPrimaryIPFns
} from "@src/components/implementations/hetznerCloud/AssignPrimaryIP";

export class AssignPrimaryIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.AssignPrimaryIP",
      ...AssignPrimaryIPStatic,
    });
  }
}
extendFns(AssignPrimaryIP, AssignPrimaryIPFns);
