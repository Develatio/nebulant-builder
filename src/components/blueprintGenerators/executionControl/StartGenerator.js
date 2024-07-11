import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";
import { convert_to_vars_struct } from "@src/components/blueprintGenerators/generic/_convert_to_vars_struct";

export class StartGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "start";

  constructor() {
    super();
    this.action = "start";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      first_action: !!parameters.first_action,

      action: this.getAction(),

      parameters: {
        vars: convert_to_vars_struct(parameters.input_parameters),
      }
    };

    return this.deepClean(blueprint);
  }
}
