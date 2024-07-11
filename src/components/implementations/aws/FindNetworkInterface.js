import { object, array, string, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { Filters } from "@src/components/implementations/aws/validators/_Filters";

import { FindNetworkInterfaceSettings } from "@src/components/settings/aws/FindNetworkInterfaceSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindNetworkInterfaceIcon from "@src/assets/img/icons/aws/iface.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["filters", "id"]).default("filters"),
        _NetworkInterfaceName: string().label("Network interface name").default(""),
        NetworkInterfaceIds: array().of(string()).default([]).label("Network interface ID"),
        MaxResults: number().label("Max results").required().min(5).max(1000).default(10),
        NextToken: string().label("Next token").default(""),
      }).concat(
        Filters
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Found network interface").default("AWS_NETWORK_INTERFACE"),
          type: result.fields.type.default("aws:network_interface"),
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
      data.settings.parameters._NetworkInterfaceName = "";

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

export const FindNetworkInterfaceStatic = {
  label: "Find Network Interface",
  icon: FindNetworkInterfaceIcon,

  data: {
    id: "find-network-interface",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const FindNetworkInterfaceFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindNetworkInterfaceSettings;
  }
};

export const FindNetworkInterfacesStatic = {
  label: "Find Network Interfaces",
  icon: FindNetworkInterfaceIcon,

  data: {
    id: "find-network-interfaces",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};
