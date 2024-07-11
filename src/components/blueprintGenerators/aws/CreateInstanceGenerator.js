import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { tagsFromArrayOfObjects } from "./_TagSpecifications";

export class CreateInstanceGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "run-instance";

  constructor() {
    super();
    this.action = "run_instance";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    parameters.TagSpecifications.push({
      value: ["Name", `${parameters._InstanceName}`],
    });
    const instanceTags = tagsFromArrayOfObjects(
      parameters.TagSpecifications,
      "instance",
    );

    const blueprint = {
      action: this.getAction(),

      parameters: {
        DisableApiTermination: parameters.DisableApiTermination,
        ImageId: parameters.ImageId?.[0],
        InstanceType: parameters.InstanceType?.[0],
        KeyName: parameters.KeyName?.[0],
        MaxCount: parameters.MaxCount,
        MinCount: parameters.MinCount,

        TagSpecifications: [
          instanceTags,
        ],
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),

        BlockDeviceMappings: [{
          DeviceName: "/dev/xvda",
          Ebs: {
            Encrypted: parameters.Encrypted,
            DeleteOnTermination: parameters._EbsDeleteOnTermination,

            ...["io1", "io2", "gp3"].includes(parameters.VolumeType?.[0]) && { Iops: parameters.Iops },
            VolumeSize: parameters.Size,
            ...parameters.VolumeType?.[0] == "gp3" && { Throughput: parameters.Throughput },
            VolumeType: parameters.VolumeType?.[0],
          },
        }],

        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    if(parameters._publicIp?.[0] != "default") {
      blueprint.parameters.NetworkInterfaces = [{
        AssociatePublicIpAddress: parameters._publicIp?.[0] == "yes" ? true : false,
        DeviceIndex: 0,
        SubnetId: parameters.SubnetId?.[0],
        Groups: parameters.SecurityGroupIds,
      }];
    } else {
      blueprint.parameters.SecurityGroupIds = parameters.SecurityGroupIds;
      blueprint.parameters.SubnetId = parameters.SubnetId?.[0];
    }

    return this.deepClean(blueprint);
  }
}
