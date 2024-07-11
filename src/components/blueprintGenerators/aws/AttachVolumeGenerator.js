import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class AttachVolumeGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "attach-volume";

  constructor() {
    super();
    this.action = "attach_volume";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Device: parameters.Device,
        VolumeId: parameters.VolumeId?.[0],
        InstanceId: parameters.InstanceId?.[0],
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}

