import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindServerStatic, FindServerFns,
} from "@src/components/implementations/hetznerCloud/FindServer";

export class FindServer extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindServer",
      ...FindServerStatic,
    });
  }
}
extendFns(FindServer, FindServerFns);
