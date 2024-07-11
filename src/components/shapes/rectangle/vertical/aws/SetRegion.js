import { util } from "@joint/core";

import { OneInOneOut } from "./OneInOneOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { SetRegionStatic, SetRegionFns } from "@src/components/implementations/aws/SetRegion";

export class SetRegion extends OneInOneOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.SetRegion",
      ...SetRegionStatic,
    });
  }
}
extendFns(SetRegion, SetRegionFns);
