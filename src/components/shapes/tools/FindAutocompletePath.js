import { elementTools } from "@joint/core";
import { Runtime } from "@src/core/Runtime";
import FindPathIcon from "@src/assets/img/icons/ui/find_path.svg";

export const FindAutocompletePath = elementTools.Button.extend({
  options: {
    markup: [
      {
        tagName: "rect",
        selector: "background",
        attributes: {
          width: 25,
          height: 25,
          fill: "white",
        },
      },
      {
        tagName: "rect",
        selector: "button",
        attributes: {
          rx: 5,
          ry: 5,
          width: 25,
          height: 25,
          fill: "transparent",
          strokeWidth: 2,
        },
      },
      {
        tagName: "image",
        selector: "icon",
        attributes: {
          x: 2,
          y: 2,
          width: 21,
          height: 21,
          "xlink:href": FindPathIcon,
        },
      },
    ],
    x: "100%",
    y: "0%",
    offset: {
      x: 10,
      y: -10
    },

    action: function(_evt) {
      const node = this.model;
      const runtime = new Runtime();
      const engine = runtime.get("objects.engine");

      // Highlight
      node.graph.getPredecessors(node, {
        deep: true,
      }).map(n => n.id).forEach(id => {
        const cell = node.graph.getCell(id);
        engine.highlightOne(cell);
      });
    }
  }
});
