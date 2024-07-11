import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class EndGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "end";

  constructor() {
    super();
    this.action = "end";
  }

  generate(_node) {
    const blueprint = {
      action: this.getAction(),
    };

    return this.deepClean(blueprint);
  }
}
