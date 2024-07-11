import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AddTargetToLoadBalancerSettings } from "@src/components/settings/hetznerCloud/AddTargetToLoadBalancerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AddTargetToLoadBalancerIcon from "@src/assets/img/icons/hetznerCloud/load_balancer.svg";

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
        UsePrivateIp: boolean().default(true),
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

export const AddTargetToLoadBalancerStatic = {
  label: "Add target to load balancer",
  icon: AddTargetToLoadBalancerIcon,
  info: "",

  data: {
    id: "add-target-to-load-balancer",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const AddTargetToLoadBalancerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AddTargetToLoadBalancerSettings;
  }
};
