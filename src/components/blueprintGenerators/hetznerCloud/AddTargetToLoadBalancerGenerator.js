import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class AddTargetToLoadBalancerGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "add-target-to-load-balancer";

  constructor() {
    super();
    this.action = "add_target_to_load_balancer";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        load_balancer: {
          ID: parameters.LoadBalancerIds[0],
        },
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    if(parameters._activeTab == "servers") {
      blueprint.parameters.type = "server";
      blueprint.parameters.server_opts = {
        Server: {
          ID: parameters.ServerIds[0],
        },
        UsePrivateIP: parameters.UsePrivateIp
      };
    } else {
      blueprint.parameters.type = "label_selector";
      blueprint.parameters.label_selector_opts = {
        Selector: parameters.Label,
        UsePrivateIP: parameters.UsePrivateIp
      }
    }

    return this.deepClean(blueprint);
  }
}
