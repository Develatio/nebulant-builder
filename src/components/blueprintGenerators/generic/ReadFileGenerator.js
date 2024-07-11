import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class ReadFileGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "read-file";

  constructor() {
    super();
    this.action = "read_file";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),
      parameters,
      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
