import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class CreateServerGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "create-server";

  constructor() {
    super();
    this.action = "create_server";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Name: parameters.Name,
        ServerType: {
          Name: parameters.ServerTypes[0],
        },
        Image: {
          ID: parameters.ImageIds[0],
        },
        SSHKeys: parameters.SshKeys.map(id => ({ ID: id })),
        Location: {
          Name: parameters.Locations[0],
        },
        UserData: parameters.UserData,
        PublicNet: {
          EnableIPv4: parameters.PublicNet.EnableIPv4,
          EnableIPv6: parameters.PublicNet.EnableIPv6,
          ...(parameters.PublicNet.EnableIPv4 && parameters.PublicNet._autoAssignIPv4 ? {} : {
            IPv4: {
              ID: parameters.PublicNet.IPv4[0],
            },
          }),
          ...(parameters.PublicNet.EnableIPv6 && parameters.PublicNet._autoAssignIPv6 ? {} : {
            IPv6: {
              ID: parameters.PublicNet.IPv6[0],
            }
          }),
        },
        Networks: parameters.NetworkIds.map(id => ({ ID: id })),
        Labels: parameters.Labels.reduce((acc, obj) => {
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
