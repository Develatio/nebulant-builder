import { clone } from "@src/utils/lang/clone";

import { FindNetworkGenerator } from "./FindNetworkGenerator";

export class FindNetworksGenerator extends FindNetworkGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-networks";

  constructor() {
    super();
    this.action = "find_networks";
  }

  generate(node) {
    const blueprint = super.generate(node);

    const { parameters } = clone(node.data.settings);

    blueprint.parameters.PerPage = parameters.PerPage || 10;
    if(parameters.Page) {
      blueprint.parameters.Page = parameters.Page;
    }

    return blueprint;
  }
}
