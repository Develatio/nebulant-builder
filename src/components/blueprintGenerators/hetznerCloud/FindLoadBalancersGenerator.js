import { clone } from "@src/utils/lang/clone";

import { FindLoadBalancerGenerator } from "./FindLoadBalancerGenerator";

export class FindLoadBalancersGenerator extends FindLoadBalancerGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-load-balancers";

  constructor() {
    super();
    this.action = "find_load_balancers";
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
