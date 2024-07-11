import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AttachServerToNetworkSettings } from "@src/components/settings/hetznerCloud/AttachServerToNetworkSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AttachServerToNetworkIcon from "@src/assets/img/icons/hetznerCloud/server.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        ServerIds: array().of(string()).required().min(1).max(1).default([]).label("Server ID"),
        NetworkIds: array().of(string()).required().min(1).max(1).default([]).label("Network ID"),
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

export const AttachServerToNetworkStatic = {
  label: "Attach server to network",
  icon: AttachServerToNetworkIcon,
  info: "",

  data: {
    id: "attach-server-to-network",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const AttachServerToNetworkFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AttachServerToNetworkSettings;
  }
};
