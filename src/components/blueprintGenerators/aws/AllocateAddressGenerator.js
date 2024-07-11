import { clone } from "@src/utils/lang/clone";
import { BaseBlueprintGenerator } from "@src/components/blueprintGenerators/BaseBlueprintGenerator";

import { tagsFromArrayOfObjects } from "./_TagSpecifications";

export class AllocateAddressGenerator extends BaseBlueprintGenerator {
  static PROVIDER = "aws";
  static ID = "allocate-address";

  constructor() {
    super();
    this.action = "allocate_address";
  }

  generate(node) {
    const { parameters, outputs } = clone(node.data.settings);

    parameters.TagSpecifications.push({
      value: ["Name", `${parameters._EIPName}`],
    });
    const eipTags = tagsFromArrayOfObjects(
      parameters.TagSpecifications,
      "elastic-ip",
    );

    const blueprint = {
      action: this.getAction(),

      parameters: {
        NetworkBorderGroup: parameters.NetworkBorderGroup?.[0],
        TagSpecifications: [
          eipTags,
        ],
        //Address: parameters.Address,
        max_retries: parameters._maxRetries,
      },

      output: outputs.result.value,
    };

    if(parameters.Address) {
      blueprint.parameters.Address = parameters.Address;
    }

    return this.deepClean(blueprint);
  }
}
