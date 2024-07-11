import { object, string, array, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindSshKeySettings } from "@src/components/settings/hetznerCloud/FindSshKeySettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindSshKeyIcon from "@src/assets/img/icons/hetznerCloud/ssh_key.svg";

export const FindSshKeyValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id"]).default("filters"),
    Name: string().label("SSH key name").default(""),
    ids: array().of(string()).default([]).label("SSH key ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found SSH key").default("HC_SSH_KEY"),
      type: result.fields.type.default("hetznerCloud:ssh_key"),
    }),
  })
});

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindSshKeyValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindSshKeyStatic = {
  label: "Find SSH key",
  icon: FindSshKeyIcon,
  info: "",

  data: {
    id: "find-ssh-key",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindSshKeyFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindSshKeySettings;
  }
};
