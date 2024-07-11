import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindInstanceGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-instance";

  constructor() {
    super();
    this.action = "findone_instance";
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
      if(parameters._InstanceName) {
        filters.push({
          Name: "tag:Name",
          Values: [`${parameters._InstanceName}`],
        });
      }

      blueprint.parameters.Filters = filters;
    } else {
      blueprint.parameters.InstanceIds = parameters.InstanceIds;
    }

    return this.deepClean(blueprint);
  }
}
