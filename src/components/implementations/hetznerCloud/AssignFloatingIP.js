import { boolean, object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AssignFloatingIPSettings } from "@src/components/settings/hetznerCloud/AssignFloatingIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AssignFloatingIPIcon from "@src/assets/img/icons/hetznerCloud/floating_ip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        FloatingIpIds: array().of(string()).required().min(1).max(1).default([]).label("Floating IP ID"),
        ServerIds: array().of(string()).required().min(1).max(1).default([]).label("Server ID"),
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

export const AssignFloatingIPStatic = {
  label: "Assign floating IP to server",
  icon: AssignFloatingIPIcon,
  info: "",

  data: {
    id: "assign-floating-ip",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const AssignFloatingIPFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AssignFloatingIPSettings;
  }
};
