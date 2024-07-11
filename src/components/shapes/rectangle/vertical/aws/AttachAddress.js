import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { AttachAddressStatic, AttachAddressFns } from "@src/components/implementations/aws/AttachAddress";

export class AttachAddress extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.AttachAddress",
      ...AttachAddressStatic,
    });
  }
}
extendFns(AttachAddress, AttachAddressFns);
