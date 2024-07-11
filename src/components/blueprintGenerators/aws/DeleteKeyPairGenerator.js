import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class DeleteKeyPairGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "delete-key-pair";

  constructor() {
    super();
    this.action = "delete_keypair";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        KeyName: parameters.KeyName?.[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
