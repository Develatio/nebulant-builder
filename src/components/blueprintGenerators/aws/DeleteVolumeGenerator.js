import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class DeleteVolumeGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "delete-volume";

  constructor() {
    super();
    this.action = "delete_volume";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        VolumeId: parameters.VolumeId?.[0],
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
