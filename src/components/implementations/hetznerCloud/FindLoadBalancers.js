import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindLoadBalancerSettings } from "@src/components/settings/hetznerCloud/FindLoadBalancerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindLoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

import { FindLoadBalancerValidatorSchema } from "./FindLoadBalancer";

const FindLoadBalancersValidatorSchema = FindLoadBalancerValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found load balancers").default("HC_LOAD_BALANCERS"),
      type: result.fields.type.default("hetznerCloud:load_balancers"),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindLoadBalancersValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindLoadBalancersStatic = {
  label: "Find load balancers",
  icon: FindLoadBalancerIcon,
  info: "",

  data: {
    id: "find-load-balancers",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindLoadBalancersFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindLoadBalancerSettings;
  }
};
