import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindVolumeStatic, FindVolumeFns,
  FindVolumesStatic
} from "@src/components/implementations/aws/FindVolume";

export class FindVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindVolume",
      ...FindVolumeStatic,
    });
  }
}
extendFns(FindVolume, FindVolumeFns);

export class FindVolumes extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.FindVolumes",
      ...FindVolumesStatic,
    });
  }
}
extendFns(FindVolumes, FindVolumeFns);
