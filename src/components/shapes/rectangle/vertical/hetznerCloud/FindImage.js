import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindImageStatic, FindImageFns
} from "@src/components/implementations/hetznerCloud/FindImage";

export class FindImage extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindImage",
      ...FindImageStatic,
    });
  }
}
extendFns(FindImage, FindImageFns);
