import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class DebugGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "debug";

  constructor() {
    super();
    this.action = "debug";
  }

  generate(node) {
    const { parameters } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        max_retries: parameters._maxRetries,
      },
    };

    return this.deepClean(blueprint);
  }
}
