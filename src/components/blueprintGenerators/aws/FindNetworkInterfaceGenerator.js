import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindNetworkInterfaceGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-network-interface";

  constructor() {
    super();
    this.action = "findone_iface";
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
      if(parameters._NetworkInterfaceName) {
        filters.push({
          Name: "tag:Name",
          Values: [`${parameters._NetworkInterfaceName}`],
        });
      }

      blueprint.parameters.Filters = filters;
    } else {
      blueprint.parameters.NetworkInterfaceIds = parameters.NetworkInterfaceIds;
    }

    return this.deepClean(blueprint);
  }
}
