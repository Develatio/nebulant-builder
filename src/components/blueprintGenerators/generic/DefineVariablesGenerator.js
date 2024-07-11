import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";
import { convert_to_vars_struct } from "@src/components/blueprintGenerators/generic/_convert_to_vars_struct";

export class DefineVariablesGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "define-variables";

  constructor() {
    super();
    this.action = "define_variables";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        vars: convert_to_vars_struct(parameters.vars),
        files: parameters.files.reduce((acc, { value }) => {
          acc.push(value);
          return acc;
        }, []),
      }
    };

    return this.deepClean(blueprint);
  }
}

