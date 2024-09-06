import { object, array, string, number, boolean } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { UploadFilesSettings } from "@src/components/settings/generic/UploadFilesSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import UploadFilesIcon from "@src/assets/img/icons/generic/upload_files.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        paths: array().of(object({
          __uniq: number(),
          name: string(),
          value: object({
            src: string().min(1).default("").label("Source path"),
            dest: string().min(1).default("").label("Target path"),
            recursive: boolean().default(true),
          }),
        })).default([]),

        _credentials: string().default("privkeyPath"),
        target: array().of(string()).required().min(1).max(1).default([]).label("Target"),
        username: string().default(""),
        privkeyPath: string().default(""),
        privkey: string().default(""),
        passphrase: string().default(""),
        password: string().default(""),
        port: number().default(22).label("Port"),

        proxies: array().of(object({
          __uniq: number(),
          name: string(),
          value: object({
            _credentials: string().default("privkeyPath"),
            target: array().of(string()).default([]),
            username: string().default(""),
            privkeyPath: string().default(""),
            privkey: string().default(""),
            passphrase: string().default(""),
            password: string().default(""),
            port: number().default(22).label("Port"),
          }),
        })).default([]),
      }).concat(
        maxRetries
      ),
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

    // Add proxies
    ["1.0.2", (data) => {
      data.settings.parameters.proxies = [];

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Refactor files / folders container (use ArrayOfWidgets)
    ["1.0.3", (data) => {
      data.settings.parameters.paths = data.settings.parameters.paths.map((obj, idx) => ({
        __uniq: Date.now() + idx,
        name: "new-path-pair",
        value: obj,
      }));

      return {
        data,
        success: true,
        msg: "",
      };
    }],
  ]);
}

export const UploadFilesStatic = {
  label: "Upload files via SSH",
  icon: UploadFilesIcon,

  data: {
    id: "upload-files",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const UploadFilesFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = UploadFilesSettings;
  }
};

