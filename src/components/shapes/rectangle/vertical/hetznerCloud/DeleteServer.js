import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteServerStatic, DeleteServerFns
} from "@src/components/implementations/hetznerCloud/DeleteServer";

export class DeleteServer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteServer",
      ...DeleteServerStatic,
    });
  }
}
extendFns(DeleteServer, DeleteServerFns);
