import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class CreateFloatingIPGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "create-floating-ip";

  constructor() {
    super();
    this.action = "create_floating_ip";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Name: parameters.Name,
        HomeLocation: {
          Name: parameters.Locations[0],
        },
        Type: parameters.Types[0],
        labels: parameters.Labels.reduce((acc, obj) => {
          acc[obj.value[0]] = obj.value[1];
          return acc;
        }, {}),
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
