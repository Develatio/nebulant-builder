import { object, number, string } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { SleepSettings } from "@src/components/settings/executionControl/SleepSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import SleepIcon from "@src/assets/img/icons/executionControl/sleep.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        seconds: number().strict().label("Seconds").default(5),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const SleepStatic = {
  label: "Sleep",
  icon: SleepIcon,

  data: {
    id: "sleep",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "executionControl",
  },
};

export const SleepFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = SleepSettings;
  }
};
