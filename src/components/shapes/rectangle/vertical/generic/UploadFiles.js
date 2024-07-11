import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { UploadFilesStatic, UploadFilesFns } from "@src/components/implementations/generic/UploadFiles";

export class UploadFiles extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.UploadFiles",
      ...UploadFilesStatic,
    });
  }
}
extendFns(UploadFiles, UploadFilesFns);
