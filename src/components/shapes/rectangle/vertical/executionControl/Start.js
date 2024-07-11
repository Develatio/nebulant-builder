import { util } from "@joint/core";

import { OneInOneOut } from "./OneInOneOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { StartStatic, StartFns } from "@src/components/implementations/executionControl/Start";

export class Start extends OneInOneOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.Start",
      ...StartStatic,
    });
  }
}
extendFns(Start, StartFns);
