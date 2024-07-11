import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class DeleteSecurityGroupGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "delete-security-group";

  constructor() {
    super();
    this.action = "delete_securitygroup";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        GroupId: parameters.GroupId?.[0],
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
