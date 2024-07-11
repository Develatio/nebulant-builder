import { object, array, string } from "yup";

import { result } from "@src/components/implementations/aws/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { ReleaseAddressSettings } from "@src/components/settings/aws/ReleaseAddressSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import ReleaseAddressIcon from "@src/assets/img/icons/aws/eip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        AllocationId: array().of(string()).required().min(1).max(1).default([]).label("Allocation ID"),
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

export const ReleaseAddressStatic = {
  label: "Release elastic IP",
  icon: ReleaseAddressIcon,

  data: {
    id: "release-address",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const ReleaseAddressFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = ReleaseAddressSettings;
  }
};

export const ReleaseAddressesStatic = {
  label: "Release elastic IPs",
  icon: ReleaseAddressIcon,

  data: {
    id: "release-addresses",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
