import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateSubnetStatic, CreateSubnetFns
} from "@src/components/implementations/hetznerCloud/CreateSubnet";

export class CreateSubnet extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateSubnet",
      ...CreateSubnetStatic,
    });
  }
}
extendFns(CreateSubnet, CreateSubnetFns);
