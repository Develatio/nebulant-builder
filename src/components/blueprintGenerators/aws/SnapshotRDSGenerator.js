import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class SnapshotRDSGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "snapshot-rds";

  constructor() {
    super();
    this.action = "snapshot_rds";
  }

  generate(node) {
    const { _parameters, outputs } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {

      },

      output: outputs.result.value,
    };

    return this.deepClean(blueprint);
  }
}

