import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class DeleteFirewallGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "delete-firewall";

  constructor() {
    super();
    this.action = "delete_firewall";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        ID: parameters.FirewallIds[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
