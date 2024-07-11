import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { <%= it.rawNodeName %>Settings } from "@src/components/settings/<%= it.provider %>/<%= it.rawNodeName %>Settings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import <%= it.rawNodeName %>Icon from "@src/assets/img/icons/<%= it.provider %>/<%= it.iconName %>.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({

      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("").default(""),
          type: result.fields.type.default(""),
          waiters: result.fields.waiters.default([]),
          async: boolean().default(false),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const <%= it.rawNodeName %>Static = {
  label: "<%= it.nodeLabel %>",
  icon: <%= it.rawNodeName %>Icon,
  info: "",

  data: {
    id: "<%= it.generatorId %>",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "<%= it.provider %>",
  },
};

export const <%= it.rawNodeName %>Fns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = <%= it.rawNodeName %>Settings;
  }
};
