import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindSecurityGroupStatic, FindSecurityGroupFns,
  FindSecurityGroupsStatic
} from "@src/components/implementations/aws/FindSecurityGroup";

export class FindSecurityGroup extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindSecurityGroup",
      ...FindSecurityGroupStatic,
    });
  }
}
extendFns(FindSecurityGroup, FindSecurityGroupFns);

export class FindSecurityGroups extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindSecurityGroups",
      ...FindSecurityGroupsStatic,
    });
  }
}
extendFns(FindSecurityGroups, FindSecurityGroupFns);
