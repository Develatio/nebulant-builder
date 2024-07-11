import { clone } from "@src/utils/lang/clone";

import { FindSshKeyGenerator } from "./FindSshKeyGenerator";

export class FindSshKeysGenerator extends FindSshKeyGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-ssh-keys";

  constructor() {
    super();
    this.action = "find_ssh_keys";
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
