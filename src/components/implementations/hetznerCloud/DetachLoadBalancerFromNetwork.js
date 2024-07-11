import { boolean, object, string, array } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { DetachLoadBalancerFromNetworkSettings } from "@src/components/settings/hetznerCloud/DetachLoadBalancerFromNetworkSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DetachLoadBalancerFromNetworkIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        LoadBalancerIds: array().of(string()).required().min(1).max(1).default([]).label("Load balancer ID"),
        NetworkIds: array().of(string()).required().min(1).max(1).default([]).label("Network ID"),
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

export const DetachLoadBalancerFromNetworkStatic = {
  label: "Detach load balancer from network",
  icon: DetachLoadBalancerFromNetworkIcon,
  info: "",

  data: {
    id: "detach-load-balancer-from-network",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const DetachLoadBalancerFromNetworkFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DetachLoadBalancerFromNetworkSettings;
  }
};
