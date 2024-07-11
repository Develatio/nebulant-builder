import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DetachServerFromNetworkStatic, DetachServerFromNetworkFns
} from "@src/components/implementations/hetznerCloud/DetachServerFromNetwork";

export class DetachServerFromNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DetachServerFromNetwork",
      ...DetachServerFromNetworkStatic,
    });
  }
}
extendFns(DetachServerFromNetwork, DetachServerFromNetworkFns);
