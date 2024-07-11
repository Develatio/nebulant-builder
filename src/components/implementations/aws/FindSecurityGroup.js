import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { Filters } from "@src/components/implementations/aws/validators/_Filters";

import { FindSecurityGroupSettings } from "@src/components/settings/aws/FindSecurityGroupSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindSecurityGroupIcon from "@src/assets/img/icons/aws/security_group.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["filters", "id"]).default("filters"),
        _SecurityGroupName: string().label("Security group name").default(""),
        GroupIds: array().of(string()).required().default([]).label("Security group ID"),
        MaxResults: number().label("Max results").required().min(5).max(1000).default(10),
        NextToken: string().label("Next token").default(""),
      }).concat(
        Filters
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Found security group").default("AWS_SECURITY_GROUP"),
          type: result.fields.type.default("aws:security_group"),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // add default tab field
    ["1.0.1", (data) => {
      data.settings.parameters._activeTab = "filters";
      data.settings.parameters._SecurityGroupName = "";

      return {
        data,
        success: true,
        msg: "",
      };
    }],

    // add "max retries"
    ["1.0.2", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const FindSecurityGroupStatic = {
  label: "Find security group",
  icon: FindSecurityGroupIcon,

  data: {
    id: "find-security-group",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindSecurityGroupFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindSecurityGroupSettings;
  }
};

export const FindSecurityGroupsStatic = {
  label: "Find security groups",
  icon: FindSecurityGroupIcon,

  data: {
    id: "find-security-groups",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
