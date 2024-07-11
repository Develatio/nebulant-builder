import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { SendEmailStatic, SendEmailFns } from "@src/components/implementations/generic/SendEmail";

export class SendEmail extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.generic.SendEmail",
      ...SendEmailStatic,
    });
  }
}
extendFns(SendEmail, SendEmailFns);
