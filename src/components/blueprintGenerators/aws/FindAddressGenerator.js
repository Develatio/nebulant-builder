import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindAddressGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-address";

  constructor() {
    super();
    this.action = "findone_address";
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
      if(parameters._EIPName) {
        filters.push({
          Name: "tag:Name",
          Values: [`${parameters._EIPName}`],
        });
      }

      blueprint.parameters.Filters = filters;
    } else {
      blueprint.parameters.AllocationIds = parameters.AllocationIds;
    }

    return this.deepClean(blueprint);
  }
}
