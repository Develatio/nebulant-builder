import { clone } from "@src/utils/lang/clone";

import { FindServerGenerator } from "./FindServerGenerator";

export class FindServersGenerator extends FindServerGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-servers";

  constructor() {
    super();
    this.action = "find_servers";
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
