import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class AttachLoadBalancerToNetworkGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "attach-load-balancer-to-network";

  constructor() {
    super();
    this.action = "attach_load_balancer_to_network";
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
          ip: parameters._activeTab == "auto" ? parameters.Subnet[0] : parameters.IP,
          network: {
            ID: parameters.NetworkIds[0],
          },
        },
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
