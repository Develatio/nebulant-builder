import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  DeleteVolumeStatic, DeleteVolumeFns
} from "@src/components/implementations/hetznerCloud/DeleteVolume";

export class DeleteVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.DeleteVolume",
      ...DeleteVolumeStatic,
    });
  }
}
extendFns(DeleteVolume, DeleteVolumeFns);
