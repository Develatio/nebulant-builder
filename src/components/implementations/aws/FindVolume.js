import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { Filters } from "@src/components/implementations/aws/validators/_Filters";

import { FindVolumeSettings } from "@src/components/settings/aws/FindVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindVolumeIcon from "@src/assets/img/icons/aws/ebs.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["filters", "id"]).default("filters"),
        _VolumeName: string().label("Volume name").default(""),
        VolumeIds: array().of(string()).default([]).label("Volume ID"),
        MaxResults: number().label("Max results").required().min(5).max(1000).default(10),
        NextToken: string().label("Next token").default(""),
      }).concat(
        Filters
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Found EBS").default("AWS_EBS"),
          type: result.fields.type.default("aws:volume"),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // add default tab field
    ["1.0.1", (data) => {
      data.settings.parameters._activeTab = "filters";

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add "max retries"
    ["1.0.2", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const FindVolumeStatic = {
  label: "Find volume",
  icon: FindVolumeIcon,

  data: {
    id: "find-volume",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindVolumeFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindVolumeSettings;
  }
};

export const FindVolumesStatic = {
  label: "Find volumes",
  icon: FindVolumeIcon,

  data: {
    id: "find-volumes",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
