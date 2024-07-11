import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  RemoveRouteFromNetworkStatic, RemoveRouteFromNetworkFns
} from "@src/components/implementations/hetznerCloud/RemoveRouteFromNetwork";

export class RemoveRouteFromNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.RemoveRouteFromNetwork",
      ...RemoveRouteFromNetworkStatic,
    });
  }
}
extendFns(RemoveRouteFromNetwork, RemoveRouteFromNetworkFns);
