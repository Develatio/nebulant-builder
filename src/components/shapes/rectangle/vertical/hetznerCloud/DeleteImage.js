import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteImageStatic, DeleteImageFns
} from "@src/components/implementations/hetznerCloud/DeleteImage";

export class DeleteImage extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteImage",
      ...DeleteImageStatic,
    });
  }
}
extendFns(DeleteImage, DeleteImageFns);
