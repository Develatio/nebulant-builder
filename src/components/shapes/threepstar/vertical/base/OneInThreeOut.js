import { util } from "@joint/core";
import { Base } from "@src/components/implementations/base/Base";

const WIDTH = 110;
const HEIGHT = 120;

export class OneInThreeOut extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.threepstar.vertical.base.OneInThreeOut",

      size: {
        width: WIDTH,
        height: HEIGHT,
      },

      ports: {
        groups: {
          in: {
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

          "out-false": {
            position: {
              name: "absolute",
              args: {
                x: 19,
                y: HEIGHT - 6,
              },
            },
            attrs: {
              circle: {
                magnet: true,
                fill: "#37AF67",
                "link-color": "#37AF67",
                stroke: "transparent",
                strokeWidth: "25px",
                r: 4,
              },
              text: {
                text: "False",
                fontSize: 10,
                "pointer-events": "none",
              },
            },

            label: {
              position: {
                args: {
                  x: 15,
                  y: -16,
                },
              },
            },
          },

          "out-ko": {
            position: {
              name: "bottom",
              args: {
                x: 55,
                y: 90.5,
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

          "out-true": {
            position: {
              name: "absolute",
              args: {
                x: 91,
                y: HEIGHT - 6,
              },
            },
            attrs: {
              //circle: {
              //  magnet: true,
              //  stroke: "transparent",
              //  strokeWidth: "25px",
              //  fill: "#F59518",
              //  "link-color": "#F59518",
              //  r: 5,
              //},
              circle: {
                magnet: true,
                fill: "#37AF67",
                "link-color": "#37AF67",
                stroke: "transparent",
                strokeWidth: "25px",
                r: 4,
              },
              text: {
                text: "True",
                fontSize: 10,
                "pointer-events": "none",
              },
            },

            label: {
              position: {
                args: {
                  x: 8,
                  y: -16,
                },
              },
            },
          },
        },
        items: [
          {
            group: "in",
            attrs: {
              text: {
                text: '',
              },
            },
          },
          {
            group: "out-false",
            attrs: {
              text: {
                text: '',
              },
            },
          },
          {
            group: "out-ko",
            attrs: {
              text: {
                text: '',
              },
            },
          },
          {
            group: "out-true",
            attrs: {
              text: {
                text: '',
              },
            },
          },
        ],
      },

      attrs: {
        pathBody: {
          d: `
            m 74.3 0 c 3.6 0 6.8 2.4 7.7 5.9 l 27.7 104 c 1.4 5.1 -2.4 10.1 -7.7 10.1 h -23.5 c -3.6 0 -6.7 -2.4 -7.7 -5.9 l -4.1 -15.1 c -0.5 -1.8 -2 -3 -3.9 -3 h -15.6 c -1.9 0 -3.4 1.2 -3.9 3 l -4.1 15.1 c -1 3.5 -4.1 5.9 -7.7 5.9 h -23.5 c -5.3 0 -9.1 -5 -7.7 -10.1 l 27.7 -104 c 0.9 -3.5 4.1 -5.9 7.7 -5.9 h 38.6 z
          `,
          fill: "white",
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
          x: 0,
          y: 20,
          width: WIDTH,
          height: 40,
          xlinkHref: null,
          //preserveAspectRatio: "none",
        },

        label: {
          textVerticalAnchor: "top",
          textAnchor: "middle",
          x: 55,
          y: 64,
          fontSize: 12,
          lineHeight: 14,
          fill: "white",
          text: "",
        },

        info: {
          textVerticalAnchor: "top",
          width: 65,
          height: 57,
          x: 22,
          y: 31,
          fontSize: 12,
          lineHeight: 14,
          fill: "white",
          textWrap: {
            text: "",
            width: 65,
            height: 57,
            ellipsis: true
          },
        },
      }
    });
  }

  markup = [
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
      tagName: "text",
      selector: "info",
    },
  ]
}
