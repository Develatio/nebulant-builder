import { util } from "@joint/core";

import { OneInOneOut } from "./OneInOneOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { JoinThreadsStatic, JoinThreadsFns } from "@src/components/implementations/executionControl/JoinThreads";

export class JoinThreads extends OneInOneOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.JoinThreads",
      ...JoinThreadsStatic,
    });
  }
}
extendFns(JoinThreads, JoinThreadsFns);
