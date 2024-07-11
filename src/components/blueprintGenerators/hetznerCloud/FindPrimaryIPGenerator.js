import { util } from "@joint/core";
import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

import { formatFilters } from "./_Filters";

export class FindPrimaryIPGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-primary-ip";

  constructor() {
    super();
    this.action = "findone_primary_ip";
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
      if(parameters.Name) {
        blueprint.parameters.Name = parameters.Name;
      }

      const filters = formatFilters(parameters.Filters);
      blueprint.parameters = util.merge({}, blueprint.parameters, filters);
    } else {
      blueprint.parameters.id = parameters.ids[0];
    }

    return this.deepClean(blueprint);
  }
}
