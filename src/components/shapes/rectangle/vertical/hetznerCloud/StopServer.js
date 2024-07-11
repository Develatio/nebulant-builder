import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  StopServerStatic, StopServerFns
} from "@src/components/implementations/hetznerCloud/StopServer";

export class StopServer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.StopServer",
      ...StopServerStatic,
    });
  }
}
extendFns(StopServer, StopServerFns);
