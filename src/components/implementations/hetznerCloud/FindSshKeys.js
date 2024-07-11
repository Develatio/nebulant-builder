import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindSshKeySettings } from "@src/components/settings/hetznerCloud/FindSshKeySettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindSshKeyIcon from "@src/assets/img/icons/hetznerCloud/ssh_key.svg";

import { FindSshKeyValidatorSchema } from "./FindSshKey";

const FindSshKeysValidatorSchema = FindSshKeyValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found SSH keys").default("HC_SSH_KEYS"),
      type: result.fields.type.default("hetznerCloud:ssh_keys"),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindSshKeysValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindSshKeysStatic = {
  label: "Find SSH keys",
  icon: FindSshKeyIcon,
  info: "",

  data: {
    id: "find-ssh-keys",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindSshKeysFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindSshKeySettings;
  }
};
