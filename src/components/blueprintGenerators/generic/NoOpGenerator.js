import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class NoOpGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "no-op";

  constructor() {
    super();
    this.action = "noop";
  }

  generate() {
    const blueprint = {
      action: this.getAction(),
    };

    return this.deepClean(blueprint);
  }
}
