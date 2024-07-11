import { object, string, array, boolean } from "yup";

import { result } from "@src/components/implementations/hetznerCloud/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { CreateServerSettings } from "@src/components/settings/hetznerCloud/CreateServerSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateServerIcon from "@src/assets/img/icons/hetznerCloud/server.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["general", "network"]).default("general"),
        Name: string().label("Name").default(""),
        ServerTypes: array().of(string()).label("Server type").default([]).min(1).max(1),
        ImageIds: array().of(string()).label("Image").default([]).min(1).max(1),
        SshKeys: array().of(string()).label("SSH Keys").default([]),
        Locations: array().of(string()).label("Location").default([]).min(1).max(1),
        UserData: string().label("User data").default("#cloud-config\n"),
        PublicNet: object({
          EnableIPv4: boolean().default(true),
          EnableIPv6: boolean().default(true),
          _autoAssignIPv4: boolean().default(true),
          _autoAssignIPv6: boolean().default(true),
          IPv4: array().of(string()).when(["EnableIPv4", "_autoAssignIPv4"], ([EnableIPv4, _autoAssignIPv4], schema) => {
            if(EnableIPv4 && !_autoAssignIPv4) {
              return schema.min(1).max(1);
            }

            return schema;
          }).label("IPv4").default([]).max(1),
          IPv6: array().of(string()).when(["EnableIPv6", "_autoAssignIPv6"], ([EnableIPv6, _autoAssignIPv6], schema) => {
            if(EnableIPv6 && !_autoAssignIPv6) {
              return schema.min(1).max(1);
            }

            return schema;
          }).label("IPv6").default([]).max(1),
        }).default({}),
        NetworkIds: array().of(string()).when(["PublicNet"], ([PublicNet], schema) => {
          if(!PublicNet?.EnableIPv4 && !PublicNet?.EnableIPv6) {
            return schema.min(1);
          }

          return schema;
        }).label("Network ID").default([]),
        Labels: array().of(object()).label("Labels").default([]),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created server").default("HC_SERVER"),
          type: result.fields.type.default("hetznerCloud:server"),
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

export const CreateServerStatic = {
  label: "Create server",
  icon: CreateServerIcon,
  info: "",

  data: {
    id: "create-server",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "hetznerCloud",
  },
};

export const CreateServerFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateServerSettings;
  }
};
