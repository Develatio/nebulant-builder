import { boolean, object, string, array, number } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateVolumeSettings } from "@src/components/settings/hetznerCloud/CreateVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateVolumeIcon from "@src/assets/img/icons/hetznerCloud/volume.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Name: string().label("Name").default(""),
        Locations: array().of(string()).label("Location").default([]).min(1).max(1),
        Size: number().label("Size").default(10).min(10).max(10240),
        Formats: array().of(string()).label("File system").default(["ext4"]).min(1).max(1),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created volume").default("HC_VOLUME"),
          type: result.fields.type.default("hetznerCloud:volume"),
          waiters: result.fields.waiters.default(["success"]),
          async: boolean().default(false),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const CreateVolumeStatic = {
  label: "Create volume",
  icon: CreateVolumeIcon,
  info: "",

  data: {
    id: "create-volume",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateVolumeFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateVolumeSettings;
  }
};
