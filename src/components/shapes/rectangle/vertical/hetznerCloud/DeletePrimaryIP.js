import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeletePrimaryIPStatic, DeletePrimaryIPFns
} from "@src/components/implementations/hetznerCloud/DeletePrimaryIP";

export class DeletePrimaryIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeletePrimaryIP",
      ...DeletePrimaryIPStatic,
    });
  }
}
extendFns(DeletePrimaryIP, DeletePrimaryIPFns);
