import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class ManualControlGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "executionControl";
  static ID = "manual-control";

  constructor() {
    super();
    this.action = "ok/ko";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        ok: parameters.ok,
        okmsg: parameters.okmsg,
        komsg: parameters.komsg,
      },
    };

    return this.deepClean(blueprint);
  }
}
