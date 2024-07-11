import { object, array, string } from "yup";

import { result } from "@src/components/implementations/aws/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DeleteSecurityGroupSettings } from "@src/components/settings/aws/DeleteSecurityGroupSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DeleteSecurityGroupIcon from "@src/assets/img/icons/aws/security_group.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        GroupId: array().of(string()).min(1).max(1).required().default([]).label("Security group ID"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("AWS_ACTION"),
          type: result.fields.type.default("aws:action"),
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

export const DeleteSecurityGroupStatic = {
  label: "Delete security group",
  icon: DeleteSecurityGroupIcon,

  data: {
    id: "delete-security-group",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const DeleteSecurityGroupFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DeleteSecurityGroupSettings;
  }
};

export const DeleteSecurityGroupsStatic = {
  label: "Delete security groups",
  icon: DeleteSecurityGroupIcon,

  data: {
    id: "delete-security-groups",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
