import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { Filters } from "@src/components/implementations/aws/validators/_Filters";

import { FindSubnetSettings } from "@src/components/settings/aws/FindSubnetSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindSubnetIcon from "@src/assets/img/icons/aws/subnet.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["filters", "id"]).default("filters"),
        _SubnetName: string().label("Subnet name").default(""),
        SubnetIds: array().of(string()).default([]).label("Subnet ID"),
        MaxResults: number().label("Max results").required().min(5).max(1000).default(10),
        NextToken: string().label("Next token").default(""),
      }).concat(
        Filters
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Found subnet").default("AWS_SUBNET"),
          type: result.fields.type.default("aws:subnet"),
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

export const FindSubnetStatic = {
  label: "Find subnet",
  icon: FindSubnetIcon,

  data: {
    id: "find-subnet",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindSubnetFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindSubnetSettings;
  }
};

export const FindSubnetsStatic = {
  label: "Find subnets",
  icon: FindSubnetIcon,

  data: {
    id: "find-subnets",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
