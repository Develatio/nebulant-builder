import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateImageStatic, CreateImageFns
} from "@src/components/implementations/hetznerCloud/CreateImage";

export class CreateImage extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateImage",
      ...CreateImageStatic,
    });
  }
}
extendFns(CreateImage, CreateImageFns);
