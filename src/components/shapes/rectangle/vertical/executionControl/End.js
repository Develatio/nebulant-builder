import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { EndStatic, EndFns } from "@src/components/implementations/executionControl/End";

export class End extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.executionControl.End",
      ...EndStatic,
    });
  }
}
extendFns(End, EndFns);
