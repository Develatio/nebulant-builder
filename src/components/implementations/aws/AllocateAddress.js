import { string, object, array } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { TagSpecifications } from "@src/components/implementations/aws/validators/_TagSpecifications";

import { AllocateAddressSettings } from "@src/components/settings/aws/AllocateAddressSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AllocateAddressIcon from "@src/assets/img/icons/aws/eip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _EIPName: string().label("EIP name").default(""),
        NetworkBorderGroup: array().of(string()).min(1).max(1).label("Network Border Group").default(["us-east-1"]),
        //Address: string().label("Address").default(""),
      }).concat(
        TagSpecifications
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created EIP").default("AWS_EIP"),
          type: result.fields.type.default("aws:elastic_ip"),
          capabilities: result.fields.capabilities.default(["ip"]),
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

export const AllocateAddressStatic = {
  label: "Allocate elastic IP",
  icon: AllocateAddressIcon,

  data: {
    id: "allocate-address",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const AllocateAddressFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AllocateAddressSettings;
  },
};
