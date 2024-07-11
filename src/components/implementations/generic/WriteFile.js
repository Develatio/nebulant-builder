import { object, string, boolean } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/generic/validators/_base";

import { WriteFileSettings } from "@src/components/settings/generic/WriteFileSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import WriteFileIcon from "@src/assets/img/icons/generic/write.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        file_path: string().default("").label("File path"),
        content: string().default("").label("Content"),
        interpolate: boolean().default(true),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          type: string().default("generic:file_io"),
          value: result.fields.value.label("WRITE_OPERATION").default("WRITE_OPERATION"),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const WriteFileStatic = {
  label: "Write File",
  icon: WriteFileIcon,
  info: "",

  data: {
    id: "write-file",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const WriteFileFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = WriteFileSettings;
  }
};

