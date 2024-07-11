import { util } from "@joint/core";
import { Base } from "@src/components/implementations/base/Base";

const WIDTH = 100;
const HEIGHT = 120;

export class Rect extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.base.Rect",

      size: {
        width: WIDTH,
        height: HEIGHT,
      },

      attrs: {
        pathBody: {
          fill: "white",
          width: "calc(w)",
          height: "calc(h)",
          strokeWidth: 1,
          rx: 5,
          ry: 5,

          ...(Base.shadows() && {
            filter: {
              name: "dropShadow",
              args: {
                  dx: 5,
                  dy: 5,
                  blur: 3,
                  opacity: 0.2
              }
            },
          }),
        },

        label: {
          textVerticalAnchor: "top",
          width: "calc(w - 10)",
          height: "calc(h)",
          x: 5,
          y: 5,
          fontSize: 12,
          lineHeight: 14,
          fill: "#333333",
          textWrap: {
            width: "calc(w - 10)",
            height: "calc(h - 10)",
            ellipsis: true
          },
        },
      }
    });
  }

  markup = [
    {
      tagName: "rect",
      selector: "pathBody",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ]
}
