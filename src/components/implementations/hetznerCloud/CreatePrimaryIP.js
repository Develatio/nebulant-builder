import { boolean, object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreatePrimaryIPSettings } from "@src/components/settings/hetznerCloud/CreatePrimaryIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreatePrimaryIPIcon from "@src/assets/img/icons/hetznerCloud/primary_ip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Name: string().label("Name").default(""),
        Datacenters: array().of(string()).label("Datacenter").default([]).min(1).max(1),
        Types: array().of(string()).label("IP type").default([]).min(1).max(1),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created primary IP").default("HC_PRIMARY_IP"),
          type: result.fields.type.default("hetznerCloud:primary_ip"),
          capabilities: result.fields.capabilities.default(["ip"]),
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

export const CreatePrimaryIPStatic = {
  label: "Create primary IP",
  icon: CreatePrimaryIPIcon,
  info: "",

  data: {
    id: "create-primary-ip",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreatePrimaryIPFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreatePrimaryIPSettings;
  }
};
