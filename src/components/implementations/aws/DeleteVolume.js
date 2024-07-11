import { object, array, string, boolean } from "yup";

import { result } from "@src/components/implementations/aws/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DeleteVolumeSettings } from "@src/components/settings/aws/DeleteVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DeleteVolumeIcon from "@src/assets/img/icons/aws/ebs.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        VolumeId: array().of(string()).required().min(1).max(1).default([]).label("Volume ID"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("AWS_ACTION"),
          type: result.fields.type.default("aws:action"),
          waiters: result.fields.waiters.default(["WaitUntilVolumeDeleted"]),
          async: boolean().default(false),
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

export const DeleteVolumeStatic = {
  label: "Delete volume",
  icon: DeleteVolumeIcon,

  data: {
    id: "delete-volume",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const DeleteVolumeFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DeleteVolumeSettings;
  }
};

export const DeleteVolumesStatic = {
  label: "Delete volumes",
  icon: DeleteVolumeIcon,

  data: {
    id: "delete-volumes",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
