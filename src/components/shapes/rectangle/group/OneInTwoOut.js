import { util } from "@joint/core";
import {
  RemoveButton,
  SettingsButton,
} from "@src/components/shapes/rectangle/group/Tools";
import { Errors } from "@src/components/shapes/tools/Errors";
import { Warnings } from "@src/components/shapes/tools/Warnings";
import { Base } from "@src/components/implementations/group/Base";
import { Highlighter } from "@src/components/shapes/rectangle/group/Highlighter";

const WIDTH = 100;
const HEIGHT = 120;

export class OneInTwoOut extends Base {
  defaults() {
    return util.merge({}, super.defaults(), {
      type: "nebulant.rectangle.group.OneInTwoOut",

      icon: null,

      highlighter: Highlighter,
      cellTools: [
        RemoveButton,
        SettingsButton,
      ],
      errorsTool: Errors,
      warningsTool: Warnings,

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
                "link-color": "#57AEFF",
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

                ...(Base.shadows() && {
                  filter: {
                    name: "dropShadow",
                    args: {
                      dx: 5,
                      dy: 5,
                      blur: 3,
                      opacity: 0.2,
                    }
                  },
                }),
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

                ...(Base.shadows() && {
                  filter: {
                    name: "dropShadow",
                    args: {
                      dx: 5,
                      dy: 5,
                      blur: 3,
                      opacity: 0.2,
                    }
                  },
                }),
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
            group: "out-ko",
            attrs: {
              text: {
                text: '',
              },
            },
          },
          {
            group: "out-ok",
            attrs: {
              text: {
                text: '',
              },
            },
          },
        ],
      },

      attrs: {
        pshadow1: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "none",
          fill: "none",
          rx: 5,
          ry: 5,
        },

        pshadow2: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "none",
          fill: "none",
          rx: 5,
          ry: 5,
        },

        pshadow3: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "none",
          fill: "none",
          rx: 5,
          ry: 5,
        },

        pathBodyStack1: {
          width: WIDTH,
          height: HEIGHT,
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
          strokeWidth: 1,
        },

        pathBodyStack2: {
          width: WIDTH,
          height: HEIGHT,
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
          strokeWidth: 1,

          ...(Base.shadows() && {
            filter: {
              name: "dropShadow",
              args: {
                dx: 5,
                dy: 5,
                blur: 3,
                opacity: 0.6,
              }
            },
          }),
        },

        pathBody: {
          width: "calc(w)",
          height: "calc(h)",
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
          strokeWidth: 1,

          ...(Base.shadows() && {
            filter: {
              name: "dropShadow",
              args: {
                dx: 5,
                dy: 5,
                blur: 3,
                opacity: 0.4,
              }
            },
          }),
        },

        imageRect: {
          x: 1,
          y: 15,
          width: WIDTH - 2, //"calc(w)",
          height: 75, // "calc(h - 25 - ...)",
          fill: "white",
          stroke: "none",
          strokeWidth: 0,
        },

        image: {
          x: 1,
          y: 10,
          width: WIDTH - 2, //"calc(w)",
          height: 75,
          xlinkHref: null,
          //preserveAspectRatio: "none",
        },

        label: {
          textVerticalAnchor: "top",
          textAnchor: "middle",
          x: "calc(w/2)",
          y: 90,
          width: WIDTH,
          fontSize: 12,
          lineHeight: 14,
          fill: "#333",
          textWrap: {
            text: "",
            width: -16,
            height: 30,
            ellipsis: true
          },
        },

        backdrop: {
          width: "calc(w)",
          height: "calc(h)",
          stroke: "none",
          fill: "none",
        }
      },

      data: {},

      state: {
        warnings: {},
        errors: {},
        isValid: true,
      }
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
      selector: "pathBodyStack1",
    },
    {
      tagName: "path",
      selector: "pathBodyStack2",
    },
    {
      tagName: "foreignObject",
      selector: "backdropblur",
      attributes: {
        x: 0,
        y: 0,
      },
    },
    {
      tagName: "path",
      selector: "pathBody",
    },
    //{
    //  tagName: "rect",
    //  selector: "imageRect",
    //},
    {
      tagName: "image",
      selector: "image",
    },
    {
      tagName: "text",
      selector: "label",
    },
  ];
}
