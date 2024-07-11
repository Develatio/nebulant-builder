import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  StartServerStatic, StartServerFns
} from "@src/components/implementations/hetznerCloud/StartServer";

export class StartServer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.StartServer",
      ...StartServerStatic,
    });
  }
}
extendFns(StartServer, StartServerFns);
