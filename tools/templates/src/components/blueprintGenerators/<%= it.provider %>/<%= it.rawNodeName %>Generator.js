import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class <%= it.rawNodeName %>Generator extends BaseBlueprintGenerator {
  static PROVIDER = "<%= it.provider %>";
  static ID = "<%= it.generatorId %>";

  constructor() {
    super();
    this.action = "<%= it.actionName %>";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),

      parameters: {
        ...(!outputs.result.async && {_waiters: outputs.result.waiters }),
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
