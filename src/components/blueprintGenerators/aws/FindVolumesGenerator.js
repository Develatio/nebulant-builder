import { clone } from "@src/utils/lang/clone";

import { FindVolumeGenerator } from "./FindVolumeGenerator";

export class FindVolumesGenerator extends FindVolumeGenerator {
  static PROVIDER = "aws";
  static ID = "find-volumes";

  constructor() {
    super();
    this.action = "find_volumes";
  }

  generate(node) {
    const blueprint = super.generate(node);

    const { parameters } = clone(node.data.settings);

    blueprint.parameters.MaxResults = parameters.MaxResults;
    if(parameters.NextToken) {
      blueprint.parameters.NextToken = parameters.NextToken;
    }

    return blueprint;
  }
}
