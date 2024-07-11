import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { DefineVariablesStatic, DefineVariablesFns } from "@src/components/implementations/generic/DefineVariables";

export class DefineVariables extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.DefineVariables",
      ...DefineVariablesStatic,
    });
  }
}
extendFns(DefineVariables, DefineVariablesFns);
