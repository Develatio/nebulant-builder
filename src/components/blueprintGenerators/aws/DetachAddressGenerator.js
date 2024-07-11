import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class DetachAddressGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "detach-address";

  constructor() {
    super();
    this.action = "detach_address";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        AssociationId: parameters.AssociationId?.[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}

