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
              name: "top",
              args: {
                x: WIDTH / 2,
                y: 0,
              },
            },
            attrs: {
              circle: {
                magnet: "passive",
                stroke: "transparent",
                strokeWidth: "25px",
                fill: "#57AEFF",
                r: 5,
              },
            },
          },

          "out-false": {
            position: {
              name: "absolute",
              args: {
                x: 19,
                y: HEIGHT,
              },
            },
            attrs: {
              circle: {
                magnet: true,
                fill: "#15DA00",
                "link-color": "#15DA00",
                stroke: "transparent",
                strokeWidth: "25px",
                r: 5,

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
                y: 95.5,
              },
            },
            attrs: {
              circle: {
                magnet: true,
                stroke: "transparent",
                strokeWidth: "25px",
                fill: "#DD180E",
                "link-color": "#DD180E",
                r: 5,

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
            },
          },

          "out-true": {
            position: {
              name: "absolute",
              args: {
                x: 91,
                y: HEIGHT,
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
                fill: "#15DA00",
                "link-color": "#15DA00",
                stroke: "transparent",
                strokeWidth: "25px",
                r: 5,

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
            attrs: {},
          },
          {
            group: "out-false",
            attrs: {},
          },
          {
            group: "out-ko",
            attrs: {},
          },
          {
            group: "out-true",
            attrs: {},
          },
        ],
      },

      attrs: {
        pathBody: {
          d: `
            M 55 7 C 58.9 7 62 3.9 62 0 H 74.3 C 77.9 0 81.1 2.4 82 5.9 L 109.7 109.9 C 111.1 115 107.3 120 102 120 H 98 C 98 116.1 94.9 113 91 113 C 87.1 113 84 116.1 84 120 H 78.5 C 74.9 120 71.8 117.6 70.8 114.1 L 66.7 99 C 66.2 97.2 64.7 96 62.8 96 H 62 C 62 95.7 62 95.3 61.9 95 C 61.4 91.6 58.5 89 55 89 C 51.5 89 48.6 91.6 48.1 95 C 48 95.3 48 95.7 48 96 H 47.2 C 45.3 96 43.8 97.2 43.3 99 L 39.2 114.1 C 38.2 117.6 35.1 120 31.5 120 H 26 C 26 116.1 22.9 113 19 113 C 15.1 113 12 116.1 12 120 H 8 C 2.7 120 -1.1 115 0.3 109.9 L 28 5.9 C 28.9 2.4 32.1 0 35.7 0 H 48 C 48 3.9 51.1 7 55 7 Z M 47.1 95 C 47.6 91.1 50.9 88 55 88 C 59.1 88 62.4 91.1 62.9 95 C 65.2 95 67.1 96.5 67.7 98.7 L 70.5 109 H 108.4 L 86 25 H 24 H 24 L 1.6 109 H 39.5 L 42.3 98.7 C 42.9 96.5 44.8 95 47.1 95 Z
          `,
          fill: "white",
          stroke: "#ccc",
          width: "calc(w)",
          height: "calc(h)",
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

        imageRect: {
          d: `
            M 47.1 95 C 47.6 91.1 50.9 88 55 88 C 59.1 88 62.4 91.1 62.9 95 C 65.2 95 67.1 96.5 67.7 98.7 L 70.5 109 H 108.4 L 86 25 H 24 H 24 L 1.6 109 H 39.5 L 42.3 98.7 C 42.9 96.5 44.8 95 47.1 95 Z
          `,
          x: 0,
          y: 0,
          width: WIDTH,
          height: HEIGHT,
          fill: "white",
          stroke: "none",
          strokeWidth: 0,
        },

        image: {
          x: 0,
          y: 30,
          width: WIDTH,
          height: 40,
          xlinkHref: null,
          //preserveAspectRatio: "none",
        },

        label: {
          textVerticalAnchor: "top",
          textAnchor: "middle",
          x: 55,
          y: 74,
          fontSize: 12,
          lineHeight: 14,
          fill: "#333",
          text: "",
        },

        info: {
          textVerticalAnchor: "top",
          width: 65,
          height: 57,
          x: 22,
          y: 34,
          fontSize: 12,
          lineHeight: 14,
          fill: "#333333",
          textWrap: {
            text: "",
            width: 65,
            height: 56,
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
      tagName: "path",
      selector: "imageRect",
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
