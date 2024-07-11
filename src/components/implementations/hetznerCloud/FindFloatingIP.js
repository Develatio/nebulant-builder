import { object, string, array, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindFloatingIPSettings } from "@src/components/settings/hetznerCloud/FindFloatingIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindFloatingIPIcon from "@src/assets/img/icons/hetznerCloud/floating_ip.svg";

export const FindFloatingIPValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id"]).default("filters"),
    Name: string().label("Floating IP name").default(""),
    ids: array().of(string()).default([]).label("Floating IP ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found floating IP").default("HC_FLOATING_IP"),
      type: result.fields.type.default("hetznerCloud:floating_ip"),
      capabilities: result.fields.capabilities.default(["ip"]),
    }),
  })
})

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindFloatingIPValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindFloatingIPStatic = {
  label: "Find floating IP",
  icon: FindFloatingIPIcon,
  info: "",

  data: {
    id: "find-floating-ip",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindFloatingIPFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindFloatingIPSettings;
  }
};
