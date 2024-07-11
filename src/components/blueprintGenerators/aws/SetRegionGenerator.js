import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class SetRegionGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "set-region";

  constructor() {
    super();
    this.action = "set_region";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        Region: parameters.Region?.[0]
      },
    };

    return this.deepClean(blueprint);
  }
}
