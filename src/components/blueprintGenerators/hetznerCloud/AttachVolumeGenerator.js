import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class AttachVolumeGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "attach-volume";

  constructor() {
    super();
    this.action = "attach_volume";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Volume: {
          ID: parameters.VolumeIds[0],
        },
        Server: {
          ID: parameters.ServerIds[0],
        },
        attach_opts: {
          Automount: parameters.Automount,
        },
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
