import { boolean, object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { RemoveTargetFromLoadBalancerSettings } from "@src/components/settings/hetznerCloud/RemoveTargetFromLoadBalancerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import RemoveTargetFromLoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["servers", "labels"]).default("servers"),
        LoadBalancerIds: array().of(string()).required().min(1).max(1).default([]).label("Load balancer ID"),
        ServerIds: array().of(string()).when("_activeTab", ([_activeTab], schema) => {
          if(_activeTab == "servers") {
            return schema.required().min(1);
          }
          return schema;
        }).max(1).default([]).label("Server IDs"),
        Label: string().when("_activeTab", ([_activeTab], schema) => {
          if(_activeTab == "labels") {
            return schema.required().min(1);
          }
          return schema;
        }).default("").label("Label"),
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

export const RemoveTargetFromLoadBalancerStatic = {
  label: "Remove target from load balancer",
  icon: RemoveTargetFromLoadBalancerIcon,
  info: "",

  data: {
    id: "remove-target-from-load-balancer",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const RemoveTargetFromLoadBalancerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = RemoveTargetFromLoadBalancerSettings;
  }
};
