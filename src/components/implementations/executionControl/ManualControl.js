import { object, boolean, string } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { ManualControlSettings } from "@src/components/settings/executionControl/ManualControlSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import ManualControlIcon from "@src/assets/img/icons/executionControl/manual-control.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        ok: boolean().strict().label("OK").default(true),
        okmsg: string().strict().label("OK message").default(""),
        komsg: string().strict().label("KO message").default(""),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const ManualControlStatic = {
  label: "Manual control",
  icon: ManualControlIcon,

  data: {
    id: "manual-control",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "executionControl",
  },
};

export const ManualControlFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = ManualControlSettings;
  }
};
