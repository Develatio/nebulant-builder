import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { Filters } from "@src/components/implementations/aws/validators/_Filters";

import { FindAddressSettings } from "@src/components/settings/aws/FindAddressSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindAddressIcon from "@src/assets/img/icons/aws/eip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["filters", "id"]).default("filters"),
        _EIPName: string().label("EIP name").default(""),
        AllocationIds: array().of(string()).default([]).label("Allocation ID"),
        MaxResults: number().label("Max results").required().min(5).max(1000).default(10),
        NextToken: string().label("Next token").default(""),
      }).concat(
        Filters
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Found EIP").default("AWS_EIP"),
          type: result.fields.type.default("aws:elastic_ip"),
          capabilities: result.fields.capabilities.default(["ip"]),
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

export const FindAddressStatic = {
  label: "Find elastic IP",
  icon: FindAddressIcon,

  data: {
    id: "find-address",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindAddressFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindAddressSettings;
  }
};

export const FindAddressesStatic = {
  label: "Find elastic IPs",
  icon: FindAddressIcon,

  data: {
    id: "find-addresses",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
