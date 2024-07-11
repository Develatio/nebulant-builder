import { util } from "@joint/core";
import { Base } from "./Base";

export class Simple extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.link.Simple",
    });
  }
}
