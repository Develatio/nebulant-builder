import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class LogGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "log";

  constructor() {
    super();
    this.action = "log";
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
