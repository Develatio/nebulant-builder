import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

export class DefineEnvVarsGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "generic";
  static ID = "define-env-vars";

  constructor() {
    super();
    this.action = "define_envs";
  }

  generate(node) {
    const { parameters } = node.data.settings;

    const blueprint = {
      action: this.getAction(),

      parameters: {
        vars: parameters.vars.reduce((acc, { value }) => {
          acc[value.name] = value.value;
          return acc;
        }, {}),
        files: parameters.files.reduce((acc, { value }) => {
          acc.push(value);
          return acc;
        }, []),
      },
    };

    return this.deepClean(blueprint);
  }
}
