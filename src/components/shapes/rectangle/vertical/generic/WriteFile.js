import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { WriteFileStatic, WriteFileFns } from "@src/components/implementations/generic/WriteFile";

export class WriteFile extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.WriteFile",
      ...WriteFileStatic,
    });
  }
}
extendFns(WriteFile, WriteFileFns);
