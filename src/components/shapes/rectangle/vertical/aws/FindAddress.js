import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindAddressStatic, FindAddressFns,
  FindAddressesStatic
} from "@src/components/implementations/aws/FindAddress";

export class FindAddress extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindAddress",
      ...FindAddressStatic,
    });
  }
}
extendFns(FindAddress, FindAddressFns);

export class FindAddresses extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindAddresses",
      ...FindAddressesStatic,
    });
  }
}
extendFns(FindAddresses, FindAddressFns);
