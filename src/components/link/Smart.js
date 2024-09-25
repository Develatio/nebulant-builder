import { util } from "@joint/core";
import { Base } from "./Base";

export class Smart extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.link.Smart",
    });
  }
}
