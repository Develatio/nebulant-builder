import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindSubnetStatic, FindSubnetFns,
  FindSubnetsStatic
} from "@src/components/implementations/aws/FindSubnet";

export class FindSubnet extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindSubnet",
      ...FindSubnetStatic,
    });
  }
}
extendFns(FindSubnet, FindSubnetFns);

export class FindSubnets extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindSubnets",
      ...FindSubnetsStatic,
    });
  }
}
extendFns(FindSubnets, FindSubnetFns);
