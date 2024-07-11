import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DetachVolumeStatic, DetachVolumeFns
} from "@src/components/implementations/hetznerCloud/DetachVolume";

export class DetachVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DetachVolume",
      ...DetachVolumeStatic,
    });
  }
}
extendFns(DetachVolume, DetachVolumeFns);
