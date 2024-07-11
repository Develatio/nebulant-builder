import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindServersStatic, FindServersFns,
} from "@src/components/implementations/hetznerCloud/FindServers";

export class FindServers extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindServers",
      ...FindServersStatic,
    });
  }
}
extendFns(FindServers, FindServersFns);
