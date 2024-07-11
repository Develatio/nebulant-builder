import { string, object, array, boolean, number } from "yup";

import { maxRetries } from "@src/components/implementations/base/validators/fields/maxRetries";
import { BaseDiagramValidator } from "@src/components/implementations/base/validators/BaseDiagramValidator";

import { result } from "@src/components/implementations/aws/validators/_base";
import { TagSpecifications } from "@src/components/implementations/aws/validators/_TagSpecifications";
import { VolumeTypeSizeDataValidator } from "@src/components/implementations/aws/validators/_VolumeTypeSizeDataValidator";

import { CreateInstanceSettings } from "@src/components/settings/aws/CreateInstanceSettings";

import { BaseDiagramMigrator } from "@src/components/implementations/base/migrators/BaseDiagramMigrator";

import CreateInstanceIcon from "@src/assets/img/icons/aws/ec2.svg";

class Validator extends BaseDiagramValidator {
  constructor() {
    super();

    this.schema = object({
      info: string().default(""),
      parameters: object({
        _InstanceName: string().label("Instance name").default(""),
        ImageId: array().of(string()).min(1).label("Image ID").default([]),
        InstanceType: array().of(string()).max(1).label("Instance type").default(["t3.nano"]),
        KeyName: array().of(string()).max(1).label("Key pair").default([]),
        MaxCount: number().min(1).max(1).label("Max count").default(1),
        MinCount: number().min(1).max(1).label("Min count").default(1),
        DisableApiTermination: boolean().required().label("Disable API termination").default(false),
        SecurityGroupIds: array().of(string()).label("Security group ID").default([]),
        SubnetId: array().of(string()).min(1).max(1).label("Subnet ID").default([]),
        _publicIp: array().of(string()).default(["default"]),
        _EbsDeleteOnTermination: boolean().label("Delete volume when instance is terminated").default(true),
      }).concat(
        TagSpecifications
      ).concat(
        VolumeTypeSizeDataValidator
      ).concat(
        maxRetries
      ),
      outputs: object({
        result: result.clone().shape({
          value: result.fields.value.label("Created instance").default("AWS_INSTANCE"),
          type: result.fields.type.default("aws:instance"),
          capabilities: result.fields.capabilities.default(["ip"]),
          waiters: result.fields.waiters.default(["WaitUntilInstanceExists", "WaitUntilInstanceRunning", "WaitUntilInstanceStatusOk"]),
        }),
      })
    });
  }
}

class Migrator extends BaseDiagramMigrator {
  migrations = new Map([
    // convert the "run_script" capability to "ssh"
    ["1.0.1", (data) => {
      data.settings.outputs.result.capabilities = data.settings.outputs.result.capabilities.map(capability => {
        if(capability == "run_script") {
          return "ssh";
        } else {
          return capability;
        }
      });

      return {
        data,
        success: true,
      };
    }],

    // remove the "ssh" capability
    ["1.0.2", (data) => {
      data.settings.outputs.result.capabilities = data.settings.outputs.result.capabilities.filter(capability => capability != "ssh");

      return {
        data,
        success: true,
      };
    }],

    // add the "ip" capability
    ["1.0.3", (data) => {
      if(!data.settings.outputs.result.capabilities.includes("ip")) {
        data.settings.outputs.result.capabilities.push("ip");
      }

      return {
        data,
        success: true,
      };
    }],

    // add more ebs opts
    ["1.0.4", (data) => {
      if(!data.settings.parameters._EbsIops) {
        if(data.settings.parameters._EbsType == "gp3") {
          data.settings.parameters._EbsIops = 3000;
        } else {
          data.settings.parameters._EbsIops = 100;
        }
      }

      if(!data.settings.parameters._EbsThroughput) {
        data.settings.parameters._EbsThroughput = 125;
      }

      return {
        data,
        success: true,
      };
    }],

    // migrate ebs opts to unified settings
    ["1.0.5", (data) => {
      data.settings.parameters.VolumeType = data.settings.parameters._EbsType;
      data.settings.parameters.Size = data.settings.parameters._EbsSize;
      data.settings.parameters.Iops = data.settings.parameters._EbsIops;
      data.settings.parameters.Throughput = data.settings.parameters._EbsThroughput;

      delete data.settings.parameters._EbsType;
      delete data.settings.parameters._EbsSize;
      delete data.settings.parameters._EbsIops;
      delete data.settings.parameters._EbsThroughput;

      return {
        data,
        success: true,
      };
    }],

    // add "max retries"
    ["1.0.6", (data) => {
      data.settings.parameters._maxRetries = 5;

      return {
        data,
        success: true,
      };
    }],
  ]);
}

export const CreateInstanceStatic = {
  label: "Create instance",
  icon: CreateInstanceIcon,

  data: {
    id: "run-instance",
    version: [...(new Migrator()).migrations.keys()].pop() || "1.0.0",
    provider: "aws",
  },
};

export const CreateInstanceFns = {
  init() {
    this.validator = new Validator();
    this.migrator = new Migrator();
    this.settingsTemplate = CreateInstanceSettings;
  }
};
