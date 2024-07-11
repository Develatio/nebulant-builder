import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteKeyPairStatic, DeleteKeyPairFns,
  DeleteKeyPairsStatic
} from "@src/components/implementations/aws/DeleteKeyPair";

export class DeleteKeyPair extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DeleteKeyPair",
      ...DeleteKeyPairStatic,
    });
  }
}
extendFns(DeleteKeyPair, DeleteKeyPairFns);

export class DeleteKeyPairs extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DeleteKeyPairs",
      ...DeleteKeyPairsStatic,
    });
  }
}
extendFns(DeleteKeyPairs, DeleteKeyPairFns);
