import { clone } from "@src/utils/lang/clone";

import { FindNetworkInterfaceGenerator } from "./FindNetworkInterfaceGenerator";

export class FindNetworkInterfacesGenerator extends FindNetworkInterfaceGenerator {
  static PROVIDER = "aws";
  static ID = "find-network-interfaces";

  constructor() {
    super();
    this.action = "find_ifaces";
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
