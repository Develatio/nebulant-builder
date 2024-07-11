import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteSecurityGroupStatic, DeleteSecurityGroupFns,
  DeleteSecurityGroupsStatic
} from "@src/components/implementations/aws/DeleteSecurityGroup";

export class DeleteSecurityGroup extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DeleteSecurityGroup",
      ...DeleteSecurityGroupStatic,
    });
  }
}
extendFns(DeleteSecurityGroup, DeleteSecurityGroupFns);

export class DeleteSecurityGroups extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DeleteSecurityGroups",
      ...DeleteSecurityGroupsStatic,
    });
  }
}
extendFns(DeleteSecurityGroups, DeleteSecurityGroupFns);
