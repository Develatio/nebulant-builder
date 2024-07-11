import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreatePrimaryIPStatic, CreatePrimaryIPFns
} from "@src/components/implementations/hetznerCloud/CreatePrimaryIP";

export class CreatePrimaryIP extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreatePrimaryIP",
      ...CreatePrimaryIPStatic,
    });
  }
}
extendFns(CreatePrimaryIP, CreatePrimaryIPFns);
