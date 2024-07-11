import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { ReadFileStatic, ReadFileFns } from "@src/components/implementations/generic/ReadFile";

export class ReadFile extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.ReadFile",
      ...ReadFileStatic,
    });
  }
}
extendFns(ReadFile, ReadFileFns);
