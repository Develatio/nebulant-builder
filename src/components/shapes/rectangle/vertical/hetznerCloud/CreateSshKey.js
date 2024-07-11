import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateSshKeyStatic, CreateSshKeyFns
} from "@src/components/implementations/hetznerCloud/CreateSshKey";

export class CreateSshKey extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateSshKey",
      ...CreateSshKeyStatic,
    });
  }
}
extendFns(CreateSshKey, CreateSshKeyFns);
