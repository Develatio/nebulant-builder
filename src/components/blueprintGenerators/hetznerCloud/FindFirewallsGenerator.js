import { clone } from "@src/utils/lang/clone";

import { FindFirewallGenerator } from "./FindFirewallGenerator";

export class FindFirewallsGenerator extends FindFirewallGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-firewalls";

  constructor() {
    super();
    this.action = "find_firewalls";
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
