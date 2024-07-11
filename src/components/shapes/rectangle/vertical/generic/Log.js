import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { LogStatic, LogFns } from "@src/components/implementations/generic/Log";

export class Log extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.Log",
      ...LogStatic,
    });
  }
}
extendFns(Log, LogFns);
