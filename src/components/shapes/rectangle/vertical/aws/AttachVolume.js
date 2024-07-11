import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { AttachVolumeStatic, AttachVolumeFns } from "@src/components/implementations/aws/AttachVolume";

export class AttachVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.AttachVolume",
      ...AttachVolumeStatic,
    });
  }
}
extendFns(AttachVolume, AttachVolumeFns);
