import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  AssignFloatingIPStatic, AssignFloatingIPFns
} from "@src/components/implementations/hetznerCloud/AssignFloatingIP";

export class AssignFloatingIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.AssignFloatingIP",
      ...AssignFloatingIPStatic,
    });
  }
}
extendFns(AssignFloatingIP, AssignFloatingIPFns);
