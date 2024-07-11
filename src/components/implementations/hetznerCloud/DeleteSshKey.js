import { object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DeleteSshKeySettings } from "@src/components/settings/hetznerCloud/DeleteSshKeySettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DeleteSshKeyIcon from "@src/assets/img/icons/hetznerCloud/ssh_key.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        SshKeyIds: array().of(string()).required().min(1).max(1).default([]).label("SSH key ID"),
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

export const DeleteSshKeyStatic = {
  label: "Delete SSH key",
  icon: DeleteSshKeyIcon,
  info: "",

  data: {
    id: "delete-ssh-key",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const DeleteSshKeyFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DeleteSshKeySettings;
  }
};
