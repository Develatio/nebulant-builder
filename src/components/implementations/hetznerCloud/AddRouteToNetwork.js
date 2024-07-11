import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AddRouteToNetworkSettings } from "@src/components/settings/hetznerCloud/AddRouteToNetworkSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AddRouteToNetworkIcon from "@src/assets/img/icons/hetznerCloud/network.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        NetworkIds: array().of(string()).required().min(1).max(1).default([]).label("Network ID"),
        Destination: string().required().label("Destination").default("0.0.0.0/0"),
        Gateway: array().of(string()).required().min(1).max(1).label("Gateway").default(["172.16.0.2"]),
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

export const AddRouteToNetworkStatic = {
  label: "Add route to network",
  icon: AddRouteToNetworkIcon,
  info: "",

  data: {
    id: "add-route-to-network",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const AddRouteToNetworkFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AddRouteToNetworkSettings;
  }
};
