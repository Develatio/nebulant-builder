import { object, string, boolean } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/generic/validators/_base";

import { ReadFileSettings } from "@src/components/settings/generic/ReadFileSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import ReadFileIcon from "@src/assets/img/icons/generic/read.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        file_path: string().default("").label("File path"),
        interpolate: boolean().default(true),
      }),
      outputs: object({
        result: result.clone().shape({
          type: string().default("generic:user_variable"),
          value: result.fields.value.label("FILE_CONTENT").default("FILE_CONTENT"),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const ReadFileStatic = {
  label: "Read file",
  icon: ReadFileIcon,
  info: "",

  data: {
    id: "read-file",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const ReadFileFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = ReadFileSettings;
  }
};

