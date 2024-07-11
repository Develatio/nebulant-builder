import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindServerSettings } from "@src/components/settings/hetznerCloud/FindServerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindServerIcon from "@src/assets/img/icons/hetznerCloud/server.svg";

export const FindServerValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id"]).default("filters"),
    Name: string().label("Server name").default(""),
    ids: array().of(string()).default([]).label("Server ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found server").default("HC_SERVER"),
      type: result.fields.type.default("hetznerCloud:server"),
      capabilities: result.fields.capabilities.default(["ip"]),
    }),
  })
});

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindServerValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindServerStatic = {
  label: "Find server",
  icon: FindServerIcon,
  info: "",

  data: {
    id: "find-server",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindServerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindServerSettings;
  }
};
