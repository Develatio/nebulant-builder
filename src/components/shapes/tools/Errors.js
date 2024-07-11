import { elementTools } from "@joint/core";
import { Logger } from "@src/core/Logger";
import { GConfig } from "@src/core/GConfig";
import ErrorIcon from "@src/assets/img/icons/ui/error.svg";

export const Errors = elementTools.Button.extend({
  options: {
    markup: [
      {
        tagName: "rect",
        selector: "background",
        attributes: {
          x: 7,
          y: 9,
          width: 8,
          height: 8,
          fill: "white",
        },
      },
      {
        tagName: "image",
        selector: "icon",
        attributes: {
          x: 2,
          y: 2,
          width: 20,
          height: 20,
          "xlink:href": ErrorIcon,
        },
      },
    ],
    x: "100%",
    y: "100%",
    offset: {
      x: 11,
      y: -15
    },

    action: function(_evt) {
      const node = this.model;
      const logger = new Logger();
      const gconfig = new GConfig();

      gconfig.set("ui.panels.footer.visible", true);

      Object.values(node.prop("state").errors).forEach(errors => {
        errors.forEach(error => {
          const { path, message, value } = error;
          logger.error(`${path}: ${message} (Current value is "${value}")`);
        });
      });
    }
  }
});
