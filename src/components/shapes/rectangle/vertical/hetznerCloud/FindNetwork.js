import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindNetworkStatic, FindNetworkFns
} from "@src/components/implementations/hetznerCloud/FindNetwork";

export class FindNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindNetwork",
      ...FindNetworkStatic,
    });
  }
}
extendFns(FindNetwork, FindNetworkFns);
