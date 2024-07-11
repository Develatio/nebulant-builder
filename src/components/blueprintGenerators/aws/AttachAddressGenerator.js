import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class AttachAddressGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "attach-address";

  constructor() {
    super();
    this.action = "attach_address";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        AllowReassociation: parameters.AllowReassociation,
        AllocationId: parameters.AllocationId?.[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    if(parameters._activeTab == "instance") {
      blueprint.parameters.InstanceId = parameters.InstanceId?.[0];
    } else {
      blueprint.parameters.NetworkInterfaceId = parameters.NetworkInterfaceId?.[0];
    }

    return this.deepClean(blueprint);
  }
}

