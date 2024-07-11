import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class CreateLoadBalancerGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "create-load-balancer";

  constructor() {
    super();
    this.action = "create_load_balancer";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Name: parameters.Name,
        LoadBalancerType: {
          Name: parameters.LoadBalancerTypes[0],
        },
        Location: {
          Name: parameters.Locations[0],
        },
        network: {
          ID: parameters.NetworkIds[0],
        },
        Algorithm: {
          Type: parameters.Algorithms[0],
        },
        PublicInterface: parameters.PublicInterface,
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
