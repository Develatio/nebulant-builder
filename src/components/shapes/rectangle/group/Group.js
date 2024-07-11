import { util } from "@joint/core";
import { OneInTwoOut } from "./OneInTwoOut";

export class Group extends OneInTwoOut {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.group.Group"
    });
  }
}
