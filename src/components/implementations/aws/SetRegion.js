import { object, array, string } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { SetRegionSettings } from "@src/components/settings/aws/SetRegionSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import SetRegionIcon from "@src/assets/img/icons/aws/region.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Region: array().of(string()).required().min(1).max(1).default(["us-east-1"]).label("Region"),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const SetRegionStatic = {
  label: "Set region",
  icon: SetRegionIcon,

  data: {
    id: "set-region",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const SetRegionFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = SetRegionSettings;
  }
};
