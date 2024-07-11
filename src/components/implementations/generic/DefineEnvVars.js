import { object, array, string, number } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DefineEnvVarsSettings } from "@src/components/settings/generic/DefineEnvVarsSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DefineEnvVarsIcon from "@src/assets/img/icons/generic/define-env-vars.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        vars: array().of(object({
          __uniq: number(),
          name: string(),
          value: object({
            name: string().default("").min(1).label("Environment variable name"),
            value: string().default("").label("Environment variable value"),
          }),
        })).default([]),
        files: array().of(object({
          __uniq: number(),
          name: string().default(""),
          value: string().default("").required().label("File path"),
        })).default([]),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // Migrate to new data format
    ["1.0.1", (data) => {
      const vobjs = data.settings.parameters.vars;
      const fobjs = data.settings.parameters.files;

      data.settings.parameters.vars = vobjs.map(obj => ({
        name: "new-environment-variable",
        value: obj,
      }));

      data.settings.parameters.files = fobjs.map(path => ({
        name: "new-file-path",
        value: path,
      }));

      return {
        data,
        success: true,
      }
    }],
  ]);
}

export const DefineEnvVarsStatic = {
  label: "Define env vars",
  icon: DefineEnvVarsIcon,

  data: {
    id: "define-env-vars",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const DefineEnvVarsFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DefineEnvVarsSettings;
  }
};
