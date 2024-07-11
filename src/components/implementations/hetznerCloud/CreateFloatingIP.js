import { boolean, object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateFloatingIPSettings } from "@src/components/settings/hetznerCloud/CreateFloatingIPSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateFloatingIPIcon from "@src/assets/img/icons/hetznerCloud/floating_ip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Name: string().label("Name").default(""),
        Locations: array().of(string()).label("Location").default([]).min(1).max(1),
        Types: array().of(string()).label("IP type").default([]).min(1).max(1),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created floating IP").default("HC_FLOATING_IP"),
          type: result.fields.type.default("hetznerCloud:floating_ip"),
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

export const CreateFloatingIPStatic = {
  label: "Create floating IP",
  icon: CreateFloatingIPIcon,
  info: "",

  data: {
    id: "create-floating-ip",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateFloatingIPFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateFloatingIPSettings;
  }
};
