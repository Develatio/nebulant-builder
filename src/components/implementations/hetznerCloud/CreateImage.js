import { boolean, object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateImageSettings } from "@src/components/settings/hetznerCloud/CreateImageSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateImageIcon from "@src/assets/img/icons/hetznerCloud/image.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        Description: string().label("Description").default(""),
        ServerIds: array().of(string()).label("Server").default([]).min(1).max(1),
        Type: string().label("Type").default("snapshot"),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created image").default("HC_IMAGE"),
          type: result.fields.type.default("hetznerCloud:image"),
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

export const CreateImageStatic = {
  label: "Create image from server",
  icon: CreateImageIcon,
  info: "",

  data: {
    id: "create-image",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateImageFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateImageSettings;
  }
};
