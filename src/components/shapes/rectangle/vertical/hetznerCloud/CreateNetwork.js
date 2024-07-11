import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateNetworkStatic, CreateNetworkFns
} from "@src/components/implementations/hetznerCloud/CreateNetwork";

export class CreateNetwork extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateNetwork",
      ...CreateNetworkStatic,
    });
  }
}
extendFns(CreateNetwork, CreateNetworkFns);
