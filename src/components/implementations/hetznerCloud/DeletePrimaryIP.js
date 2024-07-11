import { object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DeletePrimaryIPSettings } from "@src/components/settings/hetznerCloud/DeletePrimaryIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DeletePrimaryIPIcon from "@src/assets/img/icons/hetznerCloud/primary_ip.svg";

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
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const DeletePrimaryIPStatic = {
  label: "Delete primary IP",
  icon: DeletePrimaryIPIcon,
  info: "",

  data: {
    id: "delete-primary-ip",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const DeletePrimaryIPFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DeletePrimaryIPSettings;
  }
};
