import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class StartInstanceGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "start-instance";

  constructor() {
    super();
    this.action = "start_instance";
  }

  generate(node) {
    const { parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        InstanceIds: parameters.InstanceIds,
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}

