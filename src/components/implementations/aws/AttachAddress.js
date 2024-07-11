import { object, array, string, boolean } from "yup";

import { result } from "@src/components/implementations/aws/validators/_base";
import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { AttachAddressSettings } from "@src/components/settings/aws/AttachAddressSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import AttachAddressIcon from "@src/assets/img/icons/aws/eip.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _activeTab: string().oneOf(["instance", "network_interface"]).default("instance"),
        AllowReassociation: boolean().default(true),
        AllocationId: array().of(string()).required().min(1).max(1).default([]).label("Allocation ID"),
        InstanceId: array().of(string()).required().when("_activeTab", {
          is: "instance",
          then: schema => schema.min(1).max(1),
          otherwise: schema => schema,
        }).default([]).label("Instance ID"),
        NetworkInterfaceId: array().of(string()).required().when("_activeTab", {
          is: "network_interface",
          then: schema => schema.min(1).max(1),
          otherwise: schema => schema,
        }).default([]).label("Network interface ID"),
      }).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("API action result").default("AWS_ACTION"),
          type: result.fields.type.default("aws:action"),
        }),
      }),
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // add default tab field
    ["1.0.1", (data) => {
      data.settings.parameters._activeTab = data.settings.parameters._AttachTo;
      delete data.settings.parameters._AttachTo;

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

export const AttachAddressStatic = {
  label: "Attach elastic IP",
  icon: AttachAddressIcon,

  data: {
    id: "attach-address",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const AttachAddressFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = AttachAddressSettings;
  }
};

