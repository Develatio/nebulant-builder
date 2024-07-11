import { clone } from "@src/utils/lang/clone";

import { FindVolumeGenerator } from "./FindVolumeGenerator";

export class FindVolumesGenerator extends FindVolumeGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-volumes";

  constructor() {
    super();
    this.action = "find_volumes";
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
