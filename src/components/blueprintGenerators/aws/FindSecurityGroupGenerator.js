import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { formatFilters } from "./_Filters";

export class FindSecurityGroupGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "find-security-group";

  constructor() {
    super();
    this.action = "findone_securitygroup";
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
      if(parameters._InstanceName) {
        filters.push({
          Name: "group-name",
          Values: [`${parameters._SecurityGroupName}`],
        });
      }

      const filters = formatFilters(parameters.Filters);

      blueprint.parameters.Filters = filters;
    } else {
      blueprint.parameters.GroupIds = parameters.GroupIds;
    }

    return this.deepClean(blueprint);
  }
}
