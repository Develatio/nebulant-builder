import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class ConditionGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "condition";

  constructor() {
    super();
    this.action = "condition";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        conditions: parameters.conditions_nonic,
      },
    };

    return this.deepClean(blueprint);
  }
}
