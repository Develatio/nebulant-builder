import { object, array, string } from "yup";

import { result } from "@src/components/implementations/aws/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DeleteKeyPairSettings } from "@src/components/settings/aws/DeleteKeyPairSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DeleteKeyPairIcon from "@src/assets/img/icons/aws/key_pair.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        KeyName: array().of(string()).min(1).max(1).required().default([]).label("Key name"),
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

export const DeleteKeyPairStatic = {
  label: "Delete Key Pair",
  icon: DeleteKeyPairIcon,

  data: {
    id: "delete-key-pair",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const DeleteKeyPairFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DeleteKeyPairSettings;
  }
};

export const DeleteKeyPairsStatic = {
  label: "Delete Key Pairs",
  icon: DeleteKeyPairIcon,

  data: {
    id: "delete-key-pairs",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
