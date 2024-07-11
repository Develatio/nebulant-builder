import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class CreateNetworkGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "create-network";

  constructor() {
    super();
    this.action = "create_network";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Name: parameters.Name,
        ip_range: parameters.AddressMask,
        Labels: parameters.Labels.reduce((acc, obj) => {
          acc[obj.value[0]] = obj.value[1];
          return acc;
        }, {}),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
