import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  AddRouteToNetworkStatic, AddRouteToNetworkFns
} from "@src/components/implementations/hetznerCloud/AddRouteToNetwork";

export class AddRouteToNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.AddRouteToNetwork",
      ...AddRouteToNetworkStatic,
    });
  }
}
extendFns(AddRouteToNetwork, AddRouteToNetworkFns);
