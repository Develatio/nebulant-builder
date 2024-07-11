import { object, array, string, boolean } from "yup";

import { result } from "@src/components/implementations/aws/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DetachVolumeSettings } from "@src/components/settings/aws/DetachVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DetachVolumeIcon from "@src/assets/img/icons/aws/ebs.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Force: boolean().default(false),
        VolumeId: array().of(string()).required().min(1).max(1).default([]).label("Volume ID"),
        _MultiAttached: boolean().default(false),
        InstanceId: array().of(string()).required().min(1).max(1).default([]).label("Instance ID"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("AWS_ACTION"),
          type: result.fields.type.default("aws:action"),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // add "max retries"
    ["1.0.1", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const DetachVolumeStatic = {
  label: "Detach Volume",
  icon: DetachVolumeIcon,

  data: {
    id: "detach-volume",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const DetachVolumeFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DetachVolumeSettings;
  }
};

export const DetachVolumesStatic = {
  label: "Detach Volumes",
  icon: DetachVolumeIcon,

  data: {
    id: "detach-volumes",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
