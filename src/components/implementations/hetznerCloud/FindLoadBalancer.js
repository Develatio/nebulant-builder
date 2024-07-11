import { object, string, array, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindLoadBalancerSettings } from "@src/components/settings/hetznerCloud/FindLoadBalancerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindLoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

export const FindLoadBalancerValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id"]).default("filters"),
    Name: string().label("Load balancer name").default(""),
    ids: array().of(string()).default([]).label("Load balancer ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found load balancer").default("HC_LOAD_BALANCER"),
      type: result.fields.type.default("hetznerCloud:load_balancer"),
      capabilities: result.fields.capabilities.default(["ip"]),
    }),
  })
});

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindLoadBalancerValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindLoadBalancerStatic = {
  label: "Find load balancer",
  icon: FindLoadBalancerIcon,
  info: "",

  data: {
    id: "find-load-balancer",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindLoadBalancerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindLoadBalancerSettings;
  }
};
