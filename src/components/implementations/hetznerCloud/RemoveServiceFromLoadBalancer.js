import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { RemoveServiceFromLoadBalancerSettings } from "@src/components/settings/hetznerCloud/RemoveServiceFromLoadBalancerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import RemoveServiceFromLoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        LoadBalancerIds: array().of(string()).required().min(1).max(1).default([]).label("Load balancer ID"),
        SrcPort: string().required().default("80").label("Source port"),
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

export const RemoveServiceFromLoadBalancerStatic = {
  label: "Remove service from load balancer",
  icon: RemoveServiceFromLoadBalancerIcon,
  info: "",

  data: {
    id: "remove-service-from-load-balancer",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const RemoveServiceFromLoadBalancerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = RemoveServiceFromLoadBalancerSettings;
  }
};
