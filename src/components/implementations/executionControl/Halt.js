import { object, string } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { HaltSettings } from "@src/components/settings/executionControl/HaltSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import HaltIcon from "@src/assets/img/icons/executionControl/halt.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        content: string().default("").label("Content"),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const HaltStatic = {
  label: "Halt",
  icon: HaltIcon,

  data: {
    id: "halt",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "executionControl",
  },
};

export const HaltFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = HaltSettings;
  }
};

