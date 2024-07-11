import { clone } from "@src/utils/lang/clone";

import { FindSubnetGenerator } from "./FindSubnetGenerator";

export class FindSubnetsGenerator extends FindSubnetGenerator {
  static PROVIDER = "aws";
  static ID = "find-subnets";

  constructor() {
    super();
    this.action = "find_subnets";
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
