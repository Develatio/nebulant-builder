import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindVolumeStatic, FindVolumeFns,
} from "@src/components/implementations/hetznerCloud/FindVolume";

export class FindVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindVolume",
      ...FindVolumeStatic,
    });
  }
}
extendFns(FindVolume, FindVolumeFns);
