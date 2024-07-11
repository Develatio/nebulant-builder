import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class GroupGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "group";

  constructor() {
    super();
    this.action = "group";
  }

  generate(_node) {
    const blueprint = {
      action: this.getAction(),
    };

    return this.deepClean(blueprint);
  }
}
