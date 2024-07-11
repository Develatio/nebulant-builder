import { util } from "@joint/core";
import { Base } from "./Base";

export class Smart extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.link.Smart",

      router: {
        name: "manhattan",
        args: {
          maximumLoops: 10000,
          maxAllowedDirectionChange: 180,
          startDirections: ["bottom"],
          endDirections: ["top"],
          padding: 20,
        },
      },

      connector: {
        name: "jumpover",
        args: {
          jump: "gap",
          radius: 10,
        },
      }
    });
  }
}
