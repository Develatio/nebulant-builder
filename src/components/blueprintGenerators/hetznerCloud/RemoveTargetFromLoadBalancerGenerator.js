import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class RemoveTargetFromLoadBalancerGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "remove-target-from-load-balancer";

  constructor() {
    super();
    this.action = "remove_target_from_load_balancer";
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
      blueprint.parameters.server = {
        ID: parameters.ServerIds[0],
      };
    } else {
      blueprint.parameters.type = "label_selector";
      blueprint.parameters.label_selector = parameters.Label;
    }

    return this.deepClean(blueprint);
  }
}
