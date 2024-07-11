import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteSshKeyStatic, DeleteSshKeyFns
} from "@src/components/implementations/hetznerCloud/DeleteSshKey";

export class DeleteSshKey extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteSshKey",
      ...DeleteSshKeyStatic,
    });
  }
}
extendFns(DeleteSshKey, DeleteSshKeyFns);
