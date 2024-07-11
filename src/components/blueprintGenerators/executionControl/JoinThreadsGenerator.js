import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class JoinThreadsGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "join-threads";

  constructor() {
    super();
    this.action = "join_threads";
  }

  generate(_node) {
    const blueprint = {
      action: this.getAction(),
    };

    return this.deepClean(blueprint);
  }
}
