import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class ReleaseAddressGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "release-address";

  constructor() {
    super();
    this.action = "release_address";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        AllocationId: parameters.AllocationId?.[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
