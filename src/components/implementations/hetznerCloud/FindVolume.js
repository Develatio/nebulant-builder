import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindVolumeSettings } from "@src/components/settings/hetznerCloud/FindVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindVolumeIcon from "@src/assets/img/icons/hetznerCloud/volume.svg";

export const FindVolumeValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id"]).default("filters"),
    Name: string().label("Volume name").default(""),
    ids: array().of(string()).default([]).label("Volume ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found volume").default("HC_VOLUME"),
      type: result.fields.type.default("hetznerCloud:volume"),
    }),
  })
});

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindVolumeValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindVolumeStatic = {
  label: "Find volume",
  icon: FindVolumeIcon,
  info: "",

  data: {
    id: "find-volume",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindVolumeFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindVolumeSettings;
  }
};
