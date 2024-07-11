import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";

import { FindInstanceSettings } from "@src/components/settings/aws/FindInstanceSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindInstanceIcon from "@src/assets/img/icons/aws/ec2.svg";

import { FindInstanceValidatorSchema } from "./FindInstance";

const FindInstancesValidatorSchema = FindInstanceValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found instances").default("AWS_INSTANCES"),
      type: result.fields.type.default("aws:instances"),
      capabilities: result.fields.capabilities.default(["ip"]),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();
    this.schema = FindInstancesValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // convert the "run_script" capability to "ssh"
    ["1.0.1", (data) => {
      data.settings.outputs.result.capabilities = data.settings.outputs.result.capabilities.map(capability => {
        if(capability == "run_script") {
          return "ssh";
        } else {
          return capability;
        }
      });

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // remove the "ssh" capability
    ["1.0.2", (data) => {
      data.settings.outputs.result.capabilities = data.settings.outputs.result.capabilities.filter(capability => capability != "ssh");

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add the "ip" capability
    ["1.0.3", (data) => {
      if(!data.settings.outputs.result.capabilities.includes("ip")) {
        data.settings.outputs.result.capabilities.push("ip");
      }

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add default tab field
    ["1.0.4", (data) => {
      data.settings.parameters._activeTab = "filters";

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add "max retries"
    ["1.0.5", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const FindInstancesStatic = {
  label: "Find instances",
  icon: FindInstanceIcon,

  data: {
    id: "find-instances",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindInstancesFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindInstanceSettings;
  }
};
