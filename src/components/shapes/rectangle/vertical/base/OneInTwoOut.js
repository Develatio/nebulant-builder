import { util } from "@joint/core";
import { Base } from "@src/components/implementations/base/Base";

import { Errors } from "@src/components/shapes/tools/Errors";
import { Warnings } from "@src/components/shapes/tools/Warnings";

const WIDTH = 100;
const HEIGHT = 120;

export class OneInTwoOut extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.vertical.base.OneInTwoOut",

      size: {
        width: WIDTH,
        height: HEIGHT,
      },

      ports: {
        groups: {
          "in": {
            position: {
              name: "absolute",
              args: {
                x: WIDTH / 2,
                y: 6,
              },
            },
            attrs: {
              circle: {
                magnet: "passive",
                stroke: "transparent",
                strokeWidth: "25px",
                fill: "#8B6AFF",
                r: 4,
              },
            },
          },
          "out-ko": {
            position: {
              name: "absolute",
              args: {
                x: 8,
                y: HEIGHT - 8,
              },
            },
            attrs: {
              circle: {
                magnet: true,
                stroke: "transparent",
                strokeWidth: "25px",
                fill: "#DB4C40",
                "link-color": "#DB4C40",
                r: 4,
              },
            },
          },
          "out-ok": {
            position: {
              name: "absolute",
              args: {
                x: WIDTH - 8,
                y: HEIGHT - 8,
              },
            },
            attrs: {
              circle: {
                magnet: true,
                stroke: "transparent",
                strokeWidth: "25px",
                fill: "#37AF67",
                "link-color": "#37AF67",
                r: 4,
              },
            },
          },
        },
        items: [
          {
            group: "in",
            attrs: {},
          },
          {
            group: "out-ko",
            attrs: {},
          },
          {
            group: "out-ok",
            attrs: {},
          },
        ],
      },

      attrs: {
        pshadow1: {
          width: WIDTH, //"calc(w)",
          height: HEIGHT, //"calc(h)",
          stroke: "none",
          fill: "none",
          rx: 5,
          ry: 5,
        },

        pshadow2: {
          width: WIDTH, //"calc(w)",
          height: HEIGHT, //"calc(h)",
          stroke: "none",
          fill: "none",
          rx: 5,
          ry: 5,
        },

        pshadow3: {
          width: WIDTH, //"calc(w)",
          height: HEIGHT, //"calc(h)",
          stroke: "none",
          fill: "none",
          rx: 5,
          ry: 5,
        },

        pathBody: {
          d: `
            m 6 0
            l 88 0
            a 6 6 0 0 1 6 6
            l 0 108
            a 6 6 0 0 1 -6 6
            l -88 0
            a 6 6 0 0 1 -6 -6
            l 0 -108
            a 6 6 0 0 1 6 -6
            z
          `,
          fill: "#ccc",
          stroke: "#ccc",
          width: WIDTH, //"calc(w)",
          height: HEIGHT, //"calc(h)",
          strokeWidth: 1,

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

        image: {
          x: (WIDTH / 2) - 16,
          y: 12,
          width: 32,
          height: 32,
          xlinkHref: null,
          //preserveAspectRatio: "none",
        },

        label: {
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          x: WIDTH / 2,
          y: 62,
          width: WIDTH - 8,
          height: 28,
          fontSize: 12,
          lineHeight: 14,
          fill: "white",
          textWrap: {
            text: "",
            width: WIDTH - 8,
            height: 28,
            ellipsis: true
          },
        },

        titlebg: {
          fill: "#ccc",
          ref: "title",
          width: "calc(w + 12)",
          height: "calc(h + 4)",
          x: "calc(x - 6)",
          y: "calc(y - 2)",
          rx: 4,
          ry: 4,
        },

        title: {
          textAnchor: "middle",
          textVerticalAnchor: "middle",
          x: WIDTH / 2,
          y: 94,
          fontSize: 12,
          lineHeight: 14,
          fill: "white",
          width: WIDTH - 8,
          textWrap: {
            text: "",
            width: WIDTH - 8,
            height: 14,
            ellipsis: true
          },
        },

        info: {
          textVerticalAnchor: "top",
          width: WIDTH - 8,
          height: 84,
          x: 4,
          y: 20,
          fontSize: 12,
          lineHeight: 14,
          fill: "white",
          textWrap: {
            text: "",
            width: WIDTH - 8,
            height: 84,
            ellipsis: true
          },
        },
      },

      errorsTool: Errors,
      warningsTool: Warnings,
    });
  }

  markup = [
    {
      tagName: "rect",
      selector: "pshadow1",
    },
    {
      tagName: "rect",
      selector: "pshadow2",
    },
    {
      tagName: "rect",
      selector: "pshadow3",
    },
    {
      tagName: "path",
      selector: "pathBody",
    },
    {
      tagName: "image",
      selector: "image",
    },
    {
      tagName: "text",
      selector: "label",
    },
    {
      tagName: "rect",
      selector: "titlebg",
    },
    {
      tagName: "text",
      selector: "title",
    },
    {
      tagName: "text",
      selector: "info",
    },
  ]
}
