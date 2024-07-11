import { clone } from "@src/utils/lang/clone";

import { FindKeyPairGenerator } from "./FindKeyPairGenerator";

export class FindKeyPairsGenerator extends FindKeyPairGenerator {
  static PROVIDER = "aws";
  static ID = "find-key-pairs";

  constructor() {
    super();
    this.action = "find_keypairs";
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
