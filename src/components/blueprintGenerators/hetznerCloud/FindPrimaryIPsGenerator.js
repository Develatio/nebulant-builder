import { clone } from "@src/utils/lang/clone";

import { FindPrimaryIPGenerator } from "./FindPrimaryIPGenerator";

export class FindPrimaryIPsGenerator extends FindPrimaryIPGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-primary-ips";

  constructor() {
    super();
    this.action = "find_primary_ips";
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
