import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindKeyPairGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-key-pair";

  constructor() {
    super();
    this.action = "findone_keypair";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    const blueprint = {
      action: this.getAction(),
      parameters: {
        max_retries: parameters._maxRetries,
      },
      output: outputs.result.value,
    };

    if(parameters._activeTab == "filters") {
      const filters = formatFilters(parameters.Filters);

      blueprint.parameters = {
        ...blueprint.parameters,
        ...parameters._KeyPairName && { KeyNames: [parameters._KeyPairName] },
        Filters: filters,
      };
    } else {
      blueprint.parameters = {
        ...blueprint.parameters,
        KeyPairIds: parameters.KeyPairIds,
      };
    }

    return this.deepClean(blueprint);
  }
}
