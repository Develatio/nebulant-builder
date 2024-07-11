import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteFloatingIPStatic, DeleteFloatingIPFns
} from "@src/components/implementations/hetznerCloud/DeleteFloatingIP";

export class DeleteFloatingIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteFloatingIP",
      ...DeleteFloatingIPStatic,
    });
  }
}
extendFns(DeleteFloatingIP, DeleteFloatingIPFns);
