import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindNetworksStatic, FindNetworksFns,
} from "@src/components/implementations/hetznerCloud/FindNetworks";

export class FindNetworks extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindNetworks",
      ...FindNetworksStatic,
    });
  }
}
extendFns(FindNetworks, FindNetworksFns);
