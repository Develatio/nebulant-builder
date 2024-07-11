import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindSshKeysStatic, FindSshKeysFns,
} from "@src/components/implementations/hetznerCloud/FindSshKeys";

export class FindSshKeys extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindSshKeys",
      ...FindSshKeysStatic,
    });
  }
}
extendFns(FindSshKeys, FindSshKeysFns);
