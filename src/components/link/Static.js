import { util } from "@joint/core";
import { Base } from "./Base";

export class Static extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.link.Static",

      removable: false,
      deformable: false,
    });
  }
}
