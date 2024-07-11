import { clone } from "@src/utils/lang/clone";

import { FindInstanceGenerator } from "./FindInstanceGenerator";

export class FindInstancesGenerator extends FindInstanceGenerator {
  static PROVIDER = "aws";
  static ID = "find-instances";

  constructor() {
    super();
    this.action = "find_instances";
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
