import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class HaltGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "halt";

  constructor() {
    super();
    this.action = "panic";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        content: parameters.content,
      },
    };

    return this.deepClean(blueprint);
  }
}
