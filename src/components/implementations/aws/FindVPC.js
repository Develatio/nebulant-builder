import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { Filters } from "@src/components/implementations/aws/validators/_Filters";

import { FindVPCSettings } from "@src/components/settings/aws/FindVPCSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindVPCIcon from "@src/assets/img/icons/aws/vpc.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["filters", "id"]).default("filters"),
        _VPCName: string().label("VPC name").default(""),
        VpcIds: array().of(string()).default([]).label("VPC ID"),
        MaxResults: number().label("Max results").required().min(5).max(1000).default(10),
        NextToken: string().label("Next token").default(""),
      }).concat(
        Filters
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Found VPC").default("AWS_VPC"),
          type: result.fields.type.default("aws:vpc"),
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

export const FindVPCStatic = {
  label: "Find VPC",
  icon: FindVPCIcon,

  data: {
    id: "find-vpc",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindVPCFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindVPCSettings;
  }
};

export const FindVPCsStatic = {
  label: "Find VPCs",
  icon: FindVPCIcon,

  data: {
    id: "find-vpcs",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
