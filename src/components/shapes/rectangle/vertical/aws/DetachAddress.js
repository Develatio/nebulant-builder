import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DetachAddressStatic,
  DetachAddressFns,
} from "@src/components/implementations/aws/DetachAddress";

export class DetachAddress extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DetachAddress",
      ...DetachAddressStatic,
    });
  }
}
extendFns(DetachAddress, DetachAddressFns);
