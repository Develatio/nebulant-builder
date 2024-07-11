import { object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateNetworkSettings } from "@src/components/settings/hetznerCloud/CreateNetworkSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateNetworkIcon from "@src/assets/img/icons/hetznerCloud/network.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Name: string().label("Name").default(""),
        AddressMask: string().label("Address and mask").default("172.16.0.0/24"),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created network").default("HC_NETWORK"),
          type: result.fields.type.default("hetznerCloud:network"),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const CreateNetworkStatic = {
  label: "Create network",
  icon: CreateNetworkIcon,
  info: "",

  data: {
    id: "create-network",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateNetworkFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateNetworkSettings;
  }
};
