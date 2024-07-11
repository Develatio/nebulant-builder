import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class DetachVolumeGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "detach-volume";

  constructor() {
    super();
    this.action = "detach_volume";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Force: parameters.Force,
        VolumeId: parameters.VolumeId?.[0],
        InstanceId: parameters.InstanceId?.[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
