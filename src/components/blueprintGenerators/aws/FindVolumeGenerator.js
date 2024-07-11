import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindVolumeGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-volume";

  constructor() {
    super();
    this.action = "findone_volume";
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
      if(parameters._VolumeName) {
        filters.push({
          Name: "tag:Name",
          Values: [`${parameters._VolumeName}`],
        });
      }

      blueprint.parameters.Filters = filters;
    } else {
      blueprint.parameters.VolumeIds = parameters.VolumeIds;
    }

    return this.deepClean(blueprint);
  }
}
