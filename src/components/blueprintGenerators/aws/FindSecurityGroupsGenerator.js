import { clone } from "@src/utils/lang/clone";

import { FindSecurityGroupGenerator } from "./FindSecurityGroupGenerator";

export class FindSecurityGroupsGenerator extends FindSecurityGroupGenerator {
  static PROVIDER = "aws";
  static ID = "find-security-groups";

  constructor() {
    super();
    this.action = "find_securitygroups";
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
