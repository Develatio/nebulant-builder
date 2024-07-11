import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindVPCGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-vpc";

  constructor() {
    super();
    this.action = "findone_vpc";
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
      if(parameters._VPCName) {
        filters.push({
          Name: "tag:Name",
          Values: [`${parameters._VPCName}`],
        });
      }

      blueprint.parameters.Filters = filters;
    } else {
      blueprint.parameters.VpcIds = parameters.VpcIds;
    }

    return this.deepClean(blueprint);
  }
}
