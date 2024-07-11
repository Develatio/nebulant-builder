import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindServerSettings } from "@src/components/settings/hetznerCloud/FindServerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindServerIcon from "@src/assets/img/icons/hetznerCloud/server.svg";

import { FindServerValidatorSchema } from "./FindServer";

const FindServersValidatorSchema = FindServerValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found servers").default("HC_SERVERS"),
      type: result.fields.type.default("hetznerCloud:servers"),
      capabilities: result.fields.capabilities.default(["ip"]),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindServersValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindServersStatic = {
  label: "Find servers",
  icon: FindServerIcon,
  info: "",

  data: {
    id: "find-servers",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindServersFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindServerSettings;
  }
};
