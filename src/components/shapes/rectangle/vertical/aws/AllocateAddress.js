import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { AllocateAddressStatic, AllocateAddressFns } from "@src/components/implementations/aws/AllocateAddress";

export class AllocateAddress extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.AllocateAddress",
      ...AllocateAddressStatic,
    });
  }
}
extendFns(AllocateAddress, AllocateAddressFns);
