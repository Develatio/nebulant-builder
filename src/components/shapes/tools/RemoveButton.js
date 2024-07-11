import { elementTools } from "@joint/core";
import { EventBus } from "@src/core/EventBus";

export const RemoveButton = elementTools.Button.extend({
  options: {
    x: "100%",
    y: "0%",
    offset: {
      x: -16,
      y: -16,
    },

    markup: [
      {
        tagName: "rect",
        selector: "background",
        attributes: {
          width: 32,
          height: 32,
          fill: "#333045E5",
          rx: 6,
          ry: 6,
        },
      },
      {
        tagName: "path",
        selector: "cross",
        attributes: {
            d: "m 11 11 l 11 11 m -11 0 l 11 -11 z",
            fill: "none",
            strokeLinecap: "round",
            stroke: "#FFFFFF",
            strokeWidth: 1.5,
            pointerEvents: "none",
        },
      },
    ],

    action: function(_evt) {
      const eventBus = new EventBus();
      eventBus.publish("DeleteSelectedElements");
    }
  },
});
