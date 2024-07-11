import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class DetachServerFromNetworkGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "detach-server-from-network";

  constructor() {
    super();
    this.action = "detach_server_from_network";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        server: {
          ID: parameters.ServerIds[0],
        },
        network: {
          ID: parameters.NetworkIds[0],
        },
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
