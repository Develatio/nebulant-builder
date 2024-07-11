import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindSshKeyStatic, FindSshKeyFns
} from "@src/components/implementations/hetznerCloud/FindSshKey";

export class FindSshKey extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindSshKey",
      ...FindSshKeyStatic,
    });
  }
}
extendFns(FindSshKey, FindSshKeyFns);
