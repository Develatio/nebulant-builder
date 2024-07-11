import { object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateSshKeySettings } from "@src/components/settings/hetznerCloud/CreateSshKeySettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateSshKeyIcon from "@src/assets/img/icons/hetznerCloud/ssh_key.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Name: string().label("Name").default(""),
        PublicKey: string().label("SSH public key").default(""),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created SSH key").default("HC_SSH_KEY"),
          type: result.fields.type.default("hetznerCloud:ssh_key"),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const CreateSshKeyStatic = {
  label: "Create SSH key",
  icon: CreateSshKeyIcon,
  info: "",

  data: {
    id: "create-ssh-key",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateSshKeyFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateSshKeySettings;
  }
};
