import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindImageSettings } from "@src/components/settings/hetznerCloud/FindImageSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindImagesIcon from "@src/assets/img/icons/hetznerCloud/image.svg";

import { FindImageValidatorSchema } from "./FindImage";

const FindImagesValidatorSchema = FindImageValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found images").default("HC_IMAGES"),
      type: result.fields.type.default("hetznerCloud:images"),
    }),
  })
}))

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindImagesValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindImagesStatic = {
  label: "Find images",
  icon: FindImagesIcon,
  info: "",

  data: {
    id: "find-images",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindImagesFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindImageSettings;
  }
};
