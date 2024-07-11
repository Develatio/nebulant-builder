import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AttachVolumeSettings } from "@src/components/settings/hetznerCloud/AttachVolumeSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AttachVolumeIcon from "@src/assets/img/icons/hetznerCloud/volume.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Automount: boolean().required().default(true).label("Automount"),
        VolumeIds: array().of(string()).required().min(1).max(1).default([]).label("Volume ID"),
        ServerIds: array().of(string()).required().min(1).max(1).default([]).label("Server ID"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("HC_ACTION"),
          type: result.fields.type.default("hetznerCloud:action"),
          waiters: result.fields.waiters.default(["success"]),
          async: boolean().default(false),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const AttachVolumeStatic = {
  label: "Attach volume",
  icon: AttachVolumeIcon,
  info: "",

  data: {
    id: "attach-volume",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const AttachVolumeFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AttachVolumeSettings;
  }
};
