import { clone } from "@src/utils/lang/clone";
import { castToInt } from "@src/utils/lang/castToInt";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class StopServerGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "stop-server";

  constructor() {
    super();
    this.action = "stop_server";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        ID: castToInt(parameters.ids[0]),
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
