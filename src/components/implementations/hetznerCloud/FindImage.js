import { object, string, array, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { Filters } from "@src/components/implementations/hetznerCloud/validators/_Filters";

import { FindImageSettings } from "@src/components/settings/hetznerCloud/FindImageSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindImageIcon from "@src/assets/img/icons/hetznerCloud/image.svg";

export const FindImageValidatorSchema = object({
  info: string().default(""),
  parameters: object({
    _activeTab: string().oneOf(["filters", "id", "hetzner_images"]).default("filters"),
    Name: string().label("Name").default(""),
    Description: string().label("Description").default(""),
    ImageID: array().of(string()).when("_activeTab", {
      is: "id",
      then: schema => schema.min(1).max(1),
      otherwise: schema => schema,
    }).default([]).label("Image ID"),
    HetznerImageID: array().of(string()).when("_activeTab", {
      is: "hetzner_images",
      then: schema => schema.min(1).max(1),
      otherwise: schema => schema,
    }).default([]).label("Hetzner image ID"),
    Page: number().label("Page").default(1),
    PerPage: number().label("Per page").required().min(1).max(50).default(10),
  }).concat(
    Filters.clone().shape({
      Filters: Filters.fields.Filters.default([
        {
          __uniq: Date.now() + 1,
          name: "Type",
          value: ["snapshot", "backup"],
        },
        {
          __uniq: Date.now() + 2,
          name: "Status",
          value: ["available"],
        },
      ]),
    }),
  ).concat(
    maxRetries
  ),
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found image").default("HC_IMAGE"),
      type: result.fields.type.default("hetznerCloud:image"),
    }),
  }),
});

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindImageValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindImageStatic = {
  label: "Find image",
  icon: FindImageIcon,
  info: "",

  data: {
    id: "find-image",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindImageFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindImageSettings;
  }
};
