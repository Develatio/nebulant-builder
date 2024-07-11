import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindKeyPairStatic, FindKeyPairFns,
  FindKeyPairsStatic
} from "@src/components/implementations/aws/FindKeyPair";

export class FindKeyPair extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindKeyPair",
      ...FindKeyPairStatic,
    });
  }
}
extendFns(FindKeyPair, FindKeyPairFns);

export class FindKeyPairs extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindKeyPairs",
      ...FindKeyPairsStatic,
    });
  }
}
extendFns(FindKeyPairs, FindKeyPairFns);
