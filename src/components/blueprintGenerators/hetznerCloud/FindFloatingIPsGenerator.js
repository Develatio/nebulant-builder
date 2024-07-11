import { clone } from "@src/utils/lang/clone";

import { FindFloatingIPGenerator } from "./FindFloatingIPGenerator";

export class FindFloatingIPsGenerator extends FindFloatingIPGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-floating-ips";

  constructor() {
    super();
    this.action = "find_floating_ips";
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
