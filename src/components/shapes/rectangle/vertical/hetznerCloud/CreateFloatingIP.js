import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateFloatingIPStatic, CreateFloatingIPFns
} from "@src/components/implementations/hetznerCloud/CreateFloatingIP";

export class CreateFloatingIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateFloatingIP",
      ...CreateFloatingIPStatic,
    });
  }
}
extendFns(CreateFloatingIP, CreateFloatingIPFns);
