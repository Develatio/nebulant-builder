import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindImageGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
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
      const filters = formatFilters(parameters.Filters);
      if(parameters._ImageName) {
        filters.push({
          // This is "name" and not "tag:Name" because "fuck you", AWS style
          Name: "name",
          Values: [`${parameters._ImageName}`],
        });
      }

      blueprint.parameters = {
        ...blueprint.parameters,
        Filters: filters,
        Owners: parameters._ImageOwners,
        // ExecutableUsers: parameters.ExecutableUsers,
      };
    } else if(parameters._activeTab == "id") {
      blueprint.parameters = {
        ...blueprint.parameters,
        ImageIds: parameters.ImageIds[0],
      };
    } else if(parameters._activeTab == "quickstart") {
      blueprint.parameters = {
        ...blueprint.parameters,
        ImageIds: parameters.QuickImageIds[0],
      };
    }

    return this.deepClean(blueprint);
  }
}
