import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  ReleaseAddressStatic, ReleaseAddressFns,
  ReleaseAddressesStatic
} from "@src/components/implementations/aws/ReleaseAddress";

export class ReleaseAddress extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.ReleaseAddress",
      ...ReleaseAddressStatic,
    });
  }
}
extendFns(ReleaseAddress, ReleaseAddressFns);

export class ReleaseAddresses extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.ReleaseAddresses",
      ...ReleaseAddressesStatic,
    });
  }
}
extendFns(ReleaseAddresses, ReleaseAddressFns);
