import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class DetachLoadBalancerFromNetworkGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "detach-load-balancer-from-network";

  constructor() {
    super();
    this.action = "dettach_load_balancer_from_network";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        load_balancer: {
          ID: parameters.LoadBalancerIds[0],
        },
        opts: {
          network: {
            ID: parameters.NetworkIds[0],
          }
        },
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
