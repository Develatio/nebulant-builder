import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindFirewallSettings } from "@src/components/settings/hetznerCloud/FindFirewallSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindFirewallIcon from "@src/assets/img/icons/hetznerCloud/firewall.svg";

import { FindFirewallValidatorSchema } from "./FindFirewall";

const FindFirewallsValidatorSchema = FindFirewallValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found firewalls").default("HC_FIREWALLS"),
      type: result.fields.type.default("hetznerCloud:firewalls"),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindFirewallsValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindFirewallsStatic = {
  label: "Find firewalls",
  icon: FindFirewallIcon,
  info: "",

  data: {
    id: "find-firewalls",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindFirewallsFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindFirewallSettings;
  }
};
