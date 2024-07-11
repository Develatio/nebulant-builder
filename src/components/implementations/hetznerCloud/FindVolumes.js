import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindVolumeSettings } from "@src/components/settings/hetznerCloud/FindVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindVolumeIcon from "@src/assets/img/icons/hetznerCloud/volume.svg";

import { FindVolumeValidatorSchema } from "./FindVolume";

const FindVolumesValidatorSchema = FindVolumeValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found volumes").default("HC_VOLUMES"),
      type: result.fields.type.default("hetznerCloud:volumes"),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindVolumesValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindVolumesStatic = {
  label: "Find volumes",
  icon: FindVolumeIcon,
  info: "",

  data: {
    id: "find-volumes",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindVolumesFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindVolumeSettings;
  }
};
