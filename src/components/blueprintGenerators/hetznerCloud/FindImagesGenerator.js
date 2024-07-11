import { clone } from "@src/utils/lang/clone";

import { FindImageGenerator } from "./FindImageGenerator";

export class FindImagesGenerator extends FindImageGenerator {
  static PROVIDER = "hetznerCloud";
  static ID = "find-images";

  constructor() {
    super();
    this.action = "find_images";
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
