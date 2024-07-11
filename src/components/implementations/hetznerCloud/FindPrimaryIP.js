import { object, string, array, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindPrimaryIPSettings } from "@src/components/settings/hetznerCloud/FindPrimaryIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindPrimaryIPIcon from "@src/assets/img/icons/hetznerCloud/primary_ip.svg";

export const FindPrimaryIPValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id"]).default("filters"),
    Name: string().label("Primary IP name").default(""),
    ids: array().of(string()).default([]).label("Primary IP ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found primary IP").default("HC_PRIMARY_IP"),
      type: result.fields.type.default("hetznerCloud:primary_ip"),
      capabilities: result.fields.capabilities.default(["ip"]),
    }),
  })
});

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindPrimaryIPValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindPrimaryIPStatic = {
  label: "Find primary IP",
  icon: FindPrimaryIPIcon,
  info: "",

  data: {
    id: "find-primary-ip",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindPrimaryIPFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindPrimaryIPSettings;
  }
};
