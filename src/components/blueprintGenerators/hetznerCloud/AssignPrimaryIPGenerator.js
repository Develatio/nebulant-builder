import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class AssignPrimaryIPGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "assign-primary-ip";

  constructor() {
    super();
    this.action = "assign_primary_ip";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        ID: parameters.PrimaryIpIds[0],
        AssigneeID: parameters.ServerIds[0],
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
