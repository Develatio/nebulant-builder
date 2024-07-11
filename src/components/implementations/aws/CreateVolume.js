import { string, object, array, boolean } from "yup";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";

import { result } from "@src/components/implementations/aws/validators/_base";
import { TagSpecifications } from "@src/components/implementations/aws/validators/_TagSpecifications";
import { VolumeTypeSizeDataValidator } from "@src/components/implementations/aws/validators/_VolumeTypeSizeDataValidator";

import { CreateVolumeSettings } from "@src/components/settings/aws/CreateVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateVolumeIcon from "@src/assets/img/icons/aws/ebs.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _VolumeName: string().label("Volume name").default(""),
        AvailabilityZone: array().of(string()).required().min(1).max(1).label("Availability zone").default(["us-east-1a"]),
        Encrypted: boolean().required().label("Encrypted").default(false),
      }).concat(
        TagSpecifications
      ).concat(
        VolumeTypeSizeDataValidator
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created EBS").default("AWS_EBS"),
          type: result.fields.type.default("aws:volume"),
          waiters: result.fields.waiters.default(["WaitUntilVolumeAvailable"]),
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

export const CreateVolumeStatic = {
  label: "Create volume",
  icon: CreateVolumeIcon,

  data: {
    id: "create-volume",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const CreateVolumeFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateVolumeSettings;
  }
};
