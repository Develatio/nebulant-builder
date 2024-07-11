import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DebugStatic, DebugFns
} from "@src/components/implementations/executionControl/Debug";

export class Debug extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.Debug",
      ...DebugStatic,
    });
  }
}
extendFns(Debug, DebugFns);
