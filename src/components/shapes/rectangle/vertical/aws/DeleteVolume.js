import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteVolumeStatic, DeleteVolumeFns,
  DeleteVolumesStatic
} from "@src/components/implementations/aws/DeleteVolume";

export class DeleteVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DeleteVolume",
      ...DeleteVolumeStatic,
    });
  }
}
extendFns(DeleteVolume, DeleteVolumeFns);

export class DeleteVolumes extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.DeleteVolumes",
      ...DeleteVolumesStatic,
    });
  }
}
extendFns(DeleteVolumes, DeleteVolumeFns);
