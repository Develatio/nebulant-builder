import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  FindVolumesStatic, FindVolumesFns,
} from "@src/components/implementations/hetznerCloud/FindVolumes";

export class FindVolumes extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.FindVolumes",
      ...FindVolumesStatic,
    });
  }
}
extendFns(FindVolumes, FindVolumesFns);
