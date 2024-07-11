import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class WriteFileGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "write-file";

  constructor() {
    super();
    this.action = "write_file";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),
      parameters: parameters,
      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}
