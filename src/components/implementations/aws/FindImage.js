import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { Filters } from "@src/components/implementations/aws/validators/_Filters";

import { FindImageSettings } from "@src/components/settings/aws/FindImageSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindImageIcon from "@src/assets/img/icons/aws/ami.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    let amiFilters = Filters.clone();
    amiFilters = amiFilters.shape({
      Filters: amiFilters.fields.Filters.default([
        {
          name: "architecture",
          value: ["x86_64"],
        },
      ])
    });

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["filters", "id", "quickstart"]).default("filters"),
        _ImageName: string().label("Image name").default("*debian-11-amd64-daily*"),
        _ImageOwners: array().label("Image owners").required().default(["self", "aws-marketplace"]),
        ImageIds: array().of(string()).required().default([]).label("Image ID"),
        QuickImageIds: array().of(string()).required().default([]).label("Image ID"),
        //ExecutableUsers: array().of(string()).required().default([]),
        MaxResults: number().label("Max results").required().min(5).max(1000).default(10),
        NextToken: string().label("Next token").default(""),
      }).concat(
        amiFilters
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Found AMI").default("AWS_AMI"),
          type: result.fields.type.default("aws:ami"),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // add "_activeTab" and "_ImageName" fields
    ["1.0.1", (data) => {
      data.settings.parameters._activeTab = "filters";
      data.settings.parameters._ImageName = "debian*";

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add "_ImageOwners" field
    ["1.0.2", (data) => {
      data.settings.parameters._ImageOwners = ["self", "aws-marketplace"];

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add "max retries"
    ["1.0.3", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],

    // add "QuickImageIds"
    ["1.0.4", (data) => {
      data.settings.parameters.QuickImageIds = [];

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const FindImageStatic = {
  label: "Find AMI",
  icon: FindImageIcon,

  data: {
    id: "find-image",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindImageFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindImageSettings;
  }
};

export const FindImagesStatic = {
  label: "Find AMIs",
  icon: FindImageIcon,

  data: {
    id: "find-images",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
