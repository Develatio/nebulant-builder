import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindSubnetGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-subnet";

  constructor() {
    super();
    this.action = "findone_subnet";
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
      if(parameters._SubnetName) {
        filters.push({
          Name: "tag:Name",
          Values: [`${parameters._SubnetName}`],
        });
      }

      blueprint.parameters.Filters = filters;
    } else {
      blueprint.parameters.SubnetIds = parameters.SubnetIds;
    }

    return this.deepClean(blueprint);
  }
}
