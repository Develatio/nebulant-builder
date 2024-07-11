import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class CreateImageGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "create-image";

  constructor() {
    super();
    this.action = "create_image_from_server";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Description: parameters.Description,
        server: {
          ID: parameters.ServerIds[0],
        },
        Type: "snapshot",
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
