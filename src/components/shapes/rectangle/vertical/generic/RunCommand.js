import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { RunCommandStatic, RunCommandFns } from "@src/components/implementations/generic/RunCommand";

export class RunCommand extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.RunCommand",
      ...RunCommandStatic,
    });
  }
}
extendFns(RunCommand, RunCommandFns);
