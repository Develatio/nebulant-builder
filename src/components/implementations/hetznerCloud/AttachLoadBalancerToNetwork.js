import { boolean, object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AttachLoadBalancerToNetworkSettings } from "@src/components/settings/hetznerCloud/AttachLoadBalancerToNetworkSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AttachLoadBalancerToNetworkIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["auto", "manual"]).default("auto"),
        LoadBalancerIds: array().of(string()).required().min(1).max(1).default([]).label("Load balancer ID"),
        NetworkIds: array().of(string()).required().min(1).max(1).default([]).label("Network ID"),
        Subnet: array().of(string()).when("_activeTab", {
          is: "auto",
          then: schema => schema.required().min(1).max(1),
          otherwise: schema => schema,
        }).default([]).label("Subnet"),
        IP: string().when("_activeTab", {
          is: "manual",
          then: schema => schema.required(),
          otherwise: schema => schema,
        }).default("").label("IP"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("HC_ACTION"),
          type: result.fields.type.default("hetznerCloud:action"),
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

export const AttachLoadBalancerToNetworkStatic = {
  label: "Attach load balancer to network",
  icon: AttachLoadBalancerToNetworkIcon,
  info: "",

  data: {
    id: "attach-load-balancer-to-network",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const AttachLoadBalancerToNetworkFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AttachLoadBalancerToNetworkSettings;
  }
};
