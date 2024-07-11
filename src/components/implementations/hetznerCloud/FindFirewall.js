import { object, string, array, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindFirewallSettings } from "@src/components/settings/hetznerCloud/FindFirewallSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindFirewallIcon from "@src/assets/img/icons/hetznerCloud/firewall.svg";

export const FindFirewallValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id"]).default("filters"),
    Name: string().label("Network name").default(""),
    ids: array().of(string()).default([]).label("Network ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found firewall").default("HC_FIREWALL"),
      type: result.fields.type.default("hetznerCloud:firewall"),
    }),
  })
});

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindFirewallValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindFirewallStatic = {
  label: "Find firewall",
  icon: FindFirewallIcon,
  info: "",

  data: {
    id: "find-firewall",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindFirewallFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindFirewallSettings;
  }
};
