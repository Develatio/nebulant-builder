import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { DefineEnvVarsStatic, DefineEnvVarsFns } from "@src/components/implementations/generic/DefineEnvVars";

export class DefineEnvVars extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.DefineEnvVars",
      ...DefineEnvVarsStatic,
    });
  }
}
extendFns(DefineEnvVars, DefineEnvVarsFns);
