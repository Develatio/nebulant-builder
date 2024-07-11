import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DetachVolumeStatic, DetachVolumeFns,
  DetachVolumesStatic
} from "@src/components/implementations/aws/DetachVolume";

export class DetachVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DetachVolume",
      ...DetachVolumeStatic,
    });
  }
}
extendFns(DetachVolume, DetachVolumeFns);

export class DetachVolumes extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DetachVolumes",
      ...DetachVolumesStatic,
    });
  }
}
extendFns(DetachVolumes, DetachVolumeFns);
