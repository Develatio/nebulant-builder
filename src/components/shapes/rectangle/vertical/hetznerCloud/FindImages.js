import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindImagesStatic, FindImagesFns
} from "@src/components/implementations/hetznerCloud/FindImages";

export class FindImages extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindImages",
      ...FindImagesStatic,
    });
  }
}
extendFns(FindImages, FindImagesFns);
