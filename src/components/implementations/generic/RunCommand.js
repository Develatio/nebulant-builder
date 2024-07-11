import { string, object, array, number, boolean } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/generic/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";

import { RunCommandSettings } from "@src/components/settings/generic/RunCommandSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import RunCommandIcon from "@src/assets/img/icons/generic/run-script.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _type: string().default("command"),
        _custom_entrypoint: boolean().default(false),

        entrypoint: string().default("").label("Entrypoint"),
        pass_to_entrypoint_as_single_param: boolean().default(false),
        command: string().default("").label("Command"),
        script: string().default("").label("Script"),
        scriptName: string().default("").label("Script name"),
        scriptParameters: string().default("").label("Script parameters"),

        _run_on_remote: boolean().default(false),
        _credentials: string().default("privkeyPath"),
        target: array().of(string()).default([]).label("Target"),
        username: string().default(""),
        privkeyPath: string().default(""),
        privkey: string().default(""),
        passphrase: string().default(""),
        password: string().default(""),
        port: number().default(22).label("Port"),

        proxies: array().of(object({
          _credentials: string().default("privkeyPath"),
          target: array().of(string()).default([]),
          username: string().default(""),
          privkeyPath: string().default(""),
          privkey: string().default(""),
          passphrase: string().default(""),
          password: string().default(""),
          port: number().default(22).label("Port"),
        })).default([]),

        // debug options
        open_dbg_shell_before: boolean().default(false),
        open_dbg_shell_after: boolean().default(false),
        open_dbg_shell_onerror: boolean().default(false),

        // env vars
        vars: array().of(object({
          __uniq: number(),
          name: string(),
          value: object({
            name: string().default("").min(1).label("Environment variable name"),
            value: string().default("").label("Environment variable value"),
          }),
        })).default([]),

        // vars target shell / interpreter
        dump_json: boolean().default(false),
        upload_to_remote_target: boolean().default(true),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          type: string().default("generic:script_execution"),
          value: result.fields.value.label("Command / script result").default("RUN_COMMAND_RESULT"),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // Add some properties
    ["1.0.1", (data) => {
      // Add the "_vars_shell_target" property
      if(!data.settings.parameters._vars_shell_target) {
        data.settings.parameters._vars_shell_target = ["none"];
      }

      // Add the "vars" property
      if(!data.settings.parameters.vars) {
        data.settings.parameters.vars = [];
      }

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Add some properties
    ["1.0.2", (data) => {
      // Rename the "_vars_shell_target" property to "vars_target"
      data.settings.parameters.vars_target = data.settings.parameters._vars_shell_target;
      delete data.settings.parameters._vars_shell_target;

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Remove "none" from "vars_targets
    ["1.0.3", (data) => {
      // Rename the "vars_target" property to "vars_targets"
      data.settings.parameters.vars_targets = data.settings.parameters.vars_target;
      delete data.settings.parameters.vars_target;

      // Remove the "none" value from "vars_targets"
      data.settings.parameters.vars_targets = data.settings.parameters.vars_targets.filter(v => v != "none");

      // Add the "upload_to_remote_target" property
      data.settings.parameters.upload_to_remote_target = true;

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    ["1.0.4", (data) => {
      if(data.settings.parameters._type == "path") {
        data.settings.parameters._type = "command";
        data.settings.parameters.command = data.settings.parameters.scriptPath;
        delete data.settings.parameters.scriptPath;
      }

      data.settings.parameters.entrypoint = "";

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    ["1.0.5", (data) => {
      data.settings.parameters._custom_entrypoint = false;
      data.settings.parameters.scriptName = "";

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    ["1.0.6", (data) => {
      data.settings.parameters.pass_to_entrypoint_as_single_param = false;

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    ["1.0.7", (data) => {
      data.settings.parameters.target = data.settings.parameters.target[0];

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    ["1.0.8", (data) => {
      data.settings.parameters.target = [data.settings.parameters.target];

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Migrate to new data format
    ["1.0.9", (data) => {
      const vobjs = data.settings.parameters.vars;

      data.settings.parameters.vars = vobjs.map(obj => ({
        name: "new-environment-variable",
        value: obj,
      }));

      return {
        data,
        success: true,
      }
    }],

    // Remove vars_targets and create dump_json
    ["1.0.10", (data) => {
      delete data.settings.parameters.vars_targets;
      data.settings.parameters.dump_json = false;

      return {
        data,
        success: true,
        msg: "",
      };
    }],


    // Add _run_on_remote
    ["1.0.11", (data) => {
      const local = data.settings.parameters.target[0] == "local";
      data.settings.parameters._run_on_remote = !local;
      if(local) {
        data.settings.parameters.target = [];
      }

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Add proxies
    ["1.0.12", (data) => {
      data.settings.parameters.proxies = [];

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // Add debug options
    ["1.0.13", (data) => {
      data.settings.parameters.open_dbg_shell_before = false;
      data.settings.parameters.open_dbg_shell_after = false;
      data.settings.parameters.open_dbg_shell_onerror = false;

      return {
        data,
        success: true,
        msg: "",
      };
    }],
  ]);
}

export const RunCommandStatic = {
  label: "Run command",
  icon: RunCommandIcon,

  data: {
    id: "run-command",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "generic",
  },
};

export const RunCommandFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = RunCommandSettings;
  }
};
