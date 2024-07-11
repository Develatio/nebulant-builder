import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindVPCStatic, FindVPCFns,
  FindVPCsStatic
} from "@src/components/implementations/aws/FindVPC";

export class FindVPC extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindVPC",
      ...FindVPCStatic,
    });
  }
}
extendFns(FindVPC, FindVPCFns);

export class FindVPCs extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindVPCs",
      ...FindVPCsStatic,
    });
  }
}
extendFns(FindVPCs, FindVPCFns);
