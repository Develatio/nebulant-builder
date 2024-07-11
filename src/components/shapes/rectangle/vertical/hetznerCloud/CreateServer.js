import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateServerStatic, CreateServerFns
} from "@src/components/implementations/hetznerCloud/CreateServer";

export class CreateServer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateServer",
      ...CreateServerStatic,
    });
  }
}
extendFns(CreateServer, CreateServerFns);
