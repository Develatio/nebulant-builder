import { object, array, string, boolean, number } from "yup";

import { uniqueVarInForm } from "@src/components/implementations/base/validators/fields/uniqueVarInForm";
import { uniqueOutputName } from "@src/components/implementations/base/validators/fields/uniqueOutputName";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";
import { allowOnlyBasicChars } from "@src/components/implementations/base/validators/fields/allowOnlyBasicChars";
import { disallowReservedNames } from "@src/components/implementations/base/validators/fields/disallowReservedNames";

import { DefineVariablesSettings } from "@src/components/settings/generic/DefineVariablesSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DefineVariablesIcon from "@src/assets/img/icons/generic/define-variables.svg";

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
            name: string().test(
              allowOnlyBasicChars
            ).test(
              uniqueOutputName
            ).test(
              uniqueVarInForm
            ).test(
              disallowReservedNames
            ).default("").min(1).label("Variable name"),
            value: string().default("").label("Variable value").when(["required", "ask_at_runtime"], ([required, ask_at_runtime], schema) => {
              if(required && !ask_at_runtime) {
                schema = schema.required();
              }
              return schema;
            }),
            required: boolean().default(false),
            ask_at_runtime: boolean().default(false),
            stack: boolean().default(false),
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
    ["1.0.1", (data) => {
      // Add the "ask_at_runtime" property
      const { vars } = data.settings.parameters;
      if(vars) {
        data.settings.parameters.vars = vars.map(obj => ({
          ...obj,
          ask_at_runtime: false,
        }));
      }

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Migrate to new data format
    ["1.0.2", (data) => {
      const vobjs = data.settings.parameters.vars;
      const fobjs = data.settings.parameters.files;

      data.settings.parameters.vars = vobjs.map(obj => ({
        name: "new-variable",
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

export const DefineVariablesStatic = {
  label: "Define blueprint vars",
  icon: DefineVariablesIcon,

  data: {
    id: "define-variables",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const DefineVariablesFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DefineVariablesSettings;
  }
};

