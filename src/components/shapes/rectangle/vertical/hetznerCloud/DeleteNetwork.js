import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteNetworkStatic, DeleteNetworkFns
} from "@src/components/implementations/hetznerCloud/DeleteNetwork";

export class DeleteNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteNetwork",
      ...DeleteNetworkStatic,
    });
  }
}
extendFns(DeleteNetwork, DeleteNetworkFns);
