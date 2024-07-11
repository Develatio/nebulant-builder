import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class SleepGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "sleep";

  constructor() {
    super();
    this.action = "sleep";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        seconds: parameters.seconds,
      },
    };

    return this.deepClean(blueprint);
  }
}
