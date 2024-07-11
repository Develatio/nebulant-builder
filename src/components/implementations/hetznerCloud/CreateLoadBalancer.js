import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateLoadBalancerSettings } from "@src/components/settings/hetznerCloud/CreateLoadBalancerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateLoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["general", "services"]).default("general"),
        Name: string().label("Name").default(""),
        LoadBalancerTypes: array().of(string()).label("Load balancer type").default([]).min(1).max(1),
        Locations: array().of(string()).label("Location").default([]).min(1).max(1),
        NetworkIds: array().of(string()).label("Network ID").default([]),
        Algorithms: array().of(string()).label("Algorithm").default([]).min(1).max(1),
        PublicInterface: boolean().default(true),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created load ablancer").default("HC_LOAD_BALANCER"),
          type: result.fields.type.default("hetznerCloud:load_balancer"),
          capabilities: result.fields.capabilities.default(["ip"]),
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

export const CreateLoadBalancerStatic = {
  label: "Create load balancer",
  icon: CreateLoadBalancerIcon,
  info: "",

  data: {
    id: "create-load-balancer",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateLoadBalancerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateLoadBalancerSettings;
  }
};
