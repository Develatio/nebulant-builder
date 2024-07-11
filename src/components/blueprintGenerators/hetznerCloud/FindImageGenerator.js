import { util } from "@joint/core";
import { clone } from "@src/utils/lang/clone";
import { HetznerCloudGenerator } from "@src/components/blueprintGenerators/hetznerCloud/HetznerCloudGenerator";

import { formatFilters } from "./_Filters";

export class FindImageGenerator extends HetznerCloudGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-image";

  constructor() {
    super();
    this.action = "findone_image";
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
      blueprint.parameters = {
        ...blueprint.parameters,
        Name: parameters.Name,
        Description: parameters.Description,
      }
      const filters = formatFilters(parameters.Filters);
      blueprint.parameters = util.merge({}, blueprint.parameters, filters);
    } else if(parameters._activeTab == "id") {
      blueprint.parameters.id = parameters.ImageID[0];
    } else if(parameters._activeTab == "hetzner_images") {
      blueprint.parameters.id = parameters.HetznerImageID[0];
    }

    return this.deepClean(blueprint);
  }
}
