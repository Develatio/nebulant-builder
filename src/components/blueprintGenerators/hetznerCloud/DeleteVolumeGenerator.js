import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class DeleteVolumeGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "delete-volume";

  constructor() {
    super();
    this.action = "delete_volume";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        ID: parameters.VolumeIds[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
