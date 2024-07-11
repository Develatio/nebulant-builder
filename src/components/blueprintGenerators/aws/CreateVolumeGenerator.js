import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { tagsFromArrayOfObjects } from "./_TagSpecifications";

export class CreateVolumeGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "create-volume";

  constructor() {
    super();
    this.action = "create_volume";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    parameters.TagSpecifications.push({
      value: ["Name", `${parameters._VolumeName}`],
    });
    const ebsTags = tagsFromArrayOfObjects(
      parameters.TagSpecifications,
      "volume",
    );

    const blueprint = {
      action: this.getAction(),

      parameters: {
        AvailabilityZone: parameters.AvailabilityZone?.[0],
        Encrypted: parameters.Encrypted,
        ...["io1", "io2", "gp3"].includes(parameters.VolumeType?.[0]) && { Iops: parameters.Iops },
        VolumeSize: parameters.Size,
        ...parameters.VolumeType?.[0] == "gp3" && { Throughput: parameters.Throughput },
        VolumeType: parameters.VolumeType?.[0],
        TagSpecifications: [
          ebsTags,
        ],
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
