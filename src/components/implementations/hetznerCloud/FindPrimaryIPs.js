import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindPrimaryIPSettings } from "@src/components/settings/hetznerCloud/FindPrimaryIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindPrimaryIPIcon from "@src/assets/img/icons/hetznerCloud/primary_ip.svg";

import { FindPrimaryIPValidatorSchema } from "./FindPrimaryIP";

const FindPrimaryIPsValidatorSchema = FindPrimaryIPValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found primary IPs").default("HC_PRIMARY_IPS"),
      type: result.fields.type.default("hetznerCloud:primary_ips"),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindPrimaryIPsValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindPrimaryIPsStatic = {
  label: "Find primary IPs",
  icon: FindPrimaryIPIcon,
  info: "",

  data: {
    id: "find-primary-ips",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindPrimaryIPsFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindPrimaryIPSettings;
  }
};
