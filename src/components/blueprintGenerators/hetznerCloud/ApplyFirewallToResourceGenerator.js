import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class ApplyFirewallToResourceGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "apply-firewall-to-resource";

  constructor() {
    super();
    this.action = "apply_firewall_to_resources";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        firewall: {
          ID: parameters.FirewallIds[0],
        },
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    if(parameters._activeTab == "servers") {
      blueprint.parameters.resources = parameters.ServerIds.map(server => ({
        Type: "server",
        Server: { id: server, },
      }));
    } else {
      blueprint.parameters.resources = [{
        Type: "label_selector",
        LabelSelector: { Selector: parameters.Label, },
      }];
    }

    return this.deepClean(blueprint);
  }
}
