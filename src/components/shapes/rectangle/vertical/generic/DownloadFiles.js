import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { DownloadFilesStatic, DownloadFilesFns } from "@src/components/implementations/generic/DownloadFiles";

export class DownloadFiles extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.DownloadFiles",
      ...DownloadFilesStatic,
    });
  }
}
extendFns(DownloadFiles, DownloadFilesFns);
