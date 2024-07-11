import { boolean, object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateSubnetSettings } from "@src/components/settings/hetznerCloud/CreateSubnetSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateSubnetIcon from "@src/assets/img/icons/hetznerCloud/subnet.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        NetworkIds: array().of(string()).required().min(1).max(1).default([]).label("Network ID"),
        NetworkZone: array().of(string()).label("Network zone").default([]).min(1).max(1),
        IPRange: string().required().default("").label("IP range"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("HC_ACTION"),
          type: result.fields.type.default("hetznerCloud:action"),
          waiters: result.fields.waiters.default(["success"]),
          async: boolean().default(false),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const CreateSubnetStatic = {
  label: "Create subnet",
  icon: CreateSubnetIcon,
  info: "",

  data: {
    id: "create-subnet",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateSubnetFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateSubnetSettings;
  }
};
