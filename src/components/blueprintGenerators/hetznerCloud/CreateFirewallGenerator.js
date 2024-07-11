import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

export class CreateFirewallGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "create-firewall";

  constructor() {
    super();
    this.action = "create_firewall";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Name: parameters.Name,
        rules: [
          ...parameters.InboundRules.map(({ value }) => ({
            source_ips: value.IPs,
            Direction: "in",
            Protocol: value.Protocol,
            Port: ["tcp", "udp"].includes(value.Protocol) ? value.Port : "",
            Description: value.Description,
          })),
          ...parameters.OutboundRules.map(({ value }) => ({
            destination_ips: value.IPs,
            Direction: "out",
            Protocol: value.Protocol,
            Port: ["tcp", "udp"].includes(value.Protocol) ? value.Port : "",
            Description: value.Description,
          })),
        ],
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
