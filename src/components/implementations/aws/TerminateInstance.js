import { object, array, string, boolean } from "yup";

import { result } from "@src/components/implementations/aws/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { TerminateInstanceSettings } from "@src/components/settings/aws/TerminateInstanceSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import TerminateInstanceIcon from "@src/assets/img/icons/aws/ec2.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        InstanceIds: array().of(string()).required().min(1).max(1).default([]).label("Instance ID"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("AWS_ACTION"),
          type: result.fields.type.default("aws:action"),
          waiters: result.fields.waiters.default(["WaitUntilInstanceTerminated"]),
          async: boolean().default(false),
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

export const TerminateInstanceStatic = {
  label: "Terminate instance",
  icon: TerminateInstanceIcon,

  data: {
    id: "delete-instance",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const TerminateInstanceFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = TerminateInstanceSettings;
  }
};

export const TerminateInstancesStatic = {
  label: "Terminate instances",
  icon: TerminateInstanceIcon,

  data: {
    id: "delete-instances",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
