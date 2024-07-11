import { util } from "@joint/core";

import { OneInOneOut } from "./OneInOneOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { NoOpStatic, NoOpFns } from "@src/components/implementations/generic/NoOp";

export class NoOp extends OneInOneOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.NoOp",
      ...NoOpStatic,
    });
  }
}
extendFns(NoOp, NoOpFns);
