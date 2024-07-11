import { object, string, array, boolean } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { UnassignPrimaryIPSettings } from "@src/components/settings/hetznerCloud/UnassignPrimaryIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import UnassignPrimaryIPIcon from "@src/assets/img/icons/hetznerCloud/primary_ip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        PrimaryIpIds: array().of(string()).required().min(1).max(1).default([]).label("Primary IP ID"),
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

export const UnassignPrimaryIPStatic = {
  label: "Unassign primary IP",
  icon: UnassignPrimaryIPIcon,
  info: "",

  data: {
    id: "unassign-primary-ip",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const UnassignPrimaryIPFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = UnassignPrimaryIPSettings;
  }
};
