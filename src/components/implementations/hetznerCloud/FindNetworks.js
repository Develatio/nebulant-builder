import { object } from "yup";

import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";

import { FindNetworkSettings } from "@src/components/settings/hetznerCloud/FindNetworkSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import FindNetworkIcon from "@src/assets/img/icons/hetznerCloud/network.svg";

import { FindNetworkValidatorSchema } from "./FindNetwork";

const FindNetworksValidatorSchema = FindNetworkValidatorSchema.clone().concat(object({
  outputs: object({
    result: result.clone().shape({
      value: result.fields.value.label("Found networks").default("HC_NETWORKS"),
      type: result.fields.type.default("hetznerCloud:networks"),
    }),
  })
}));

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = FindNetworksValidatorSchema;
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const FindNetworksStatic = {
  label: "Find networks",
  icon: FindNetworkIcon,
  info: "",

  data: {
    id: "find-networks",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const FindNetworksFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = FindNetworkSettings;
  }
};
