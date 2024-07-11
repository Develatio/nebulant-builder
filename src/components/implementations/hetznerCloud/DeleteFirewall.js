import { object, string, array } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { DeleteFirewallSettings } from "@src/components/settings/hetznerCloud/DeleteFirewallSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import DeleteFirewallIcon from "@src/assets/img/icons/hetznerCloud/firewall.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        FirewallIds: array().of(string()).required().min(1).max(1).default([]).label("Firewall ID"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("HC_ACTION"),
          type: result.fields.type.default("hetznerCloud:action"),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map();
}

export const DeleteFirewallStatic = {
  label: "Delete firewall",
  icon: DeleteFirewallIcon,
  info: "",

  data: {
    id: "delete-firewall",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const DeleteFirewallFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = DeleteFirewallSettings;
  }
};
