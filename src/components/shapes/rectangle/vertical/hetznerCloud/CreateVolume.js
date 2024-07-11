import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import {
  CreateVolumeStatic, CreateVolumeFns
} from "@src/components/implementations/hetznerCloud/CreateVolume";

export class CreateVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.hetznerCloud.CreateVolume",
      ...CreateVolumeStatic,
    });
  }
}
extendFns(CreateVolume, CreateVolumeFns);
