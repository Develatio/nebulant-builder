import { clone } from "@src/utils/lang/clone";

import { FindVPCGenerator } from "./FindVPCGenerator";

export class FindVPCsGenerator extends FindVPCGenerator {
  static PROVIDER = "aws";
  static ID = "find-vpcs";

  constructor() {
    super();
    this.action = "find_vpcs";
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
