import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindImageStatic, FindImageFns,
  FindImagesStatic
} from "@src/components/implementations/aws/FindImage";

export class FindImage extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindImage",
      ...FindImageStatic,
    });
  }
}
extendFns(FindImage, FindImageFns);

export class FindImages extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindImages",
      ...FindImagesStatic,
    });
  }
}
extendFns(FindImages, FindImageFns);
