import { util } from "@joint/core";

import { OneInTwoOut } from "./OneInTwoOut";

import { extendFns } from "@src/utils/lang/extendFns";

import { CreateVolumeStatic, CreateVolumeFns } from "@src/components/implementations/aws/CreateVolume";

export class CreateVolume extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.aws.CreateVolume",
      ...CreateVolumeStatic,
    });
  }
}
extendFns(CreateVolume, CreateVolumeFns);
