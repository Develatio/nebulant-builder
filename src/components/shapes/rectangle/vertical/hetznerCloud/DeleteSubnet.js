import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteSubnetStatic, DeleteSubnetFns
} from "@src/components/implementations/hetznerCloud/DeleteSubnet";

export class DeleteSubnet extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteSubnet",
      ...DeleteSubnetStatic,
    });
  }
}
extendFns(DeleteSubnet, DeleteSubnetFns);
