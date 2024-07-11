import { clone } from "@src/utils/lang/clone";

import { FindAddressGenerator } from "./FindAddressGenerator";

export class FindAddressesGenerator extends FindAddressGenerator {
  static PROVIDER = "aws";
  static ID = "find-addresses";

  constructor() {
    super();
    this.action = "find_addresses";
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
