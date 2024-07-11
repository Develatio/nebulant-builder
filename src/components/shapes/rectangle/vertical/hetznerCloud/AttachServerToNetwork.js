import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  AttachServerToNetworkStatic, AttachServerToNetworkFns
} from "@src/components/implementations/hetznerCloud/AttachServerToNetwork";

export class AttachServerToNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.AttachServerToNetwork",
      ...AttachServerToNetworkStatic,
    });
  }
}
extendFns(AttachServerToNetwork, AttachServerToNetworkFns);
