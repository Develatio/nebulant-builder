import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindFloatingIPSettings } from "@src/components/settings/hetznerCloud/FindFloatingIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindFloatingIPIcon from "@src/assets/img/icons/hetznerCloud/floating_ip.svg";

import { FindFloatingIPValidatorSchema } from "./FindFloatingIP";

const FindFloatingIPsValidatorSchema = FindFloatingIPValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found floating IPs").default("HC_FLOATING_IPS"),
      type: result.fields.type.default("hetznerCloud:floating_ips"),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindFloatingIPsValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindFloatingIPsStatic = {
  label: "Find floating IPs",
  icon: FindFloatingIPIcon,
  info: "",

  data: {
    id: "find-floating-ips",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindFloatingIPsFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindFloatingIPSettings;
  }
};
