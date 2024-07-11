import { boolean, object, string, array, number } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateFirewallSettings } from "@src/components/settings/hetznerCloud/CreateFirewallSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateFirewallIcon from "@src/assets/img/icons/hetznerCloud/firewall.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["general", "inbound", "outbound"]).default("general"),
        Name: string().label("Name").default("").required(),
        Labels: array().of(object()).label("Labels").default([]),
        InboundRules: array().of(object({
          __uniq: number(),
          name: string(),
          value: object({
            Description: string().label("Description").default(""),
            IPs: array().of(string()).default(["0.0.0.0/0", "::/0"]),
            Protocol: string().label("Protocol").default("tcp").required(),
            Port: string().when(["Protocol"], ([Protocol], schema) => {
              switch (Protocol) {
                case "tcp":
                case "udp":
                  return schema.required();
              }
            }).label("Port").default("0-65535"),
          }),
        })).label("Inbound rules").default([{
          __uniq: Date.now(),
          name: "new-rule",
          value: {
            Description: "Allow SSH traffic from any IP",
            IPs: ["0.0.0.0/0", "::/0"],
            Protocol: "tcp",
            Port: "22",
          }
        }]),
        OutboundRules: array().of(object({
          __uniq: number(),
          name: string(),
          value: object({
            Description: string().label("Description").default(""),
            IPs: array().of(string()).default(["0.0.0.0/0", "::/0"]),
            Protocol: string().label("Protocol").default("tcp").required(),
            Port: string().when(["Protocol"], ([Protocol], schema) => {
              switch (Protocol) {
                case "tcp":
                case "udp":
                  return schema.required();
              }
            }).label("Port").default("0-65535"),
          }),
        })).label("Outbound rules").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created firewall").default("HC_FIREWALL"),
          type: result.fields.type.default("hetznerCloud:firewall"),
          waiters: result.fields.waiters.default(["success"]),
          async: boolean().default(false),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const CreateFirewallStatic = {
  label: "Create firewall",
  icon: CreateFirewallIcon,
  info: "",

  data: {
    id: "create-firewall",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateFirewallFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateFirewallSettings;
  }
};
