import { object, array, string } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { ConditionSettings } from "@src/components/settings/executionControl/ConditionSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import ConditionIcon from "@src/assets/img/icons/executionControl/condition.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        conditions: object({
          rules: array().default([]),
        }).label("Conditions"),
        conditions_cli: object({
          rules: array().default([]),
        }).label("Conditions CLI"),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const ConditionStatic = {
  label: "Condition",
  icon: ConditionIcon,

  data: {
    id: "condition",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "executionControl",
  },
};

export const ConditionFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = ConditionSettings;
  }
};
