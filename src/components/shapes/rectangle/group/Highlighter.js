import { Highlighter as BaseHighlighter } from "@src/components/shapes/highlighter";
import { hexToHSL } from "@src/utils/colors";

export const Highlighter = BaseHighlighter.extend({
  attributes: {
    ...BaseHighlighter.prototype.attributes,
  }
}, {
  highlight(view, persistent = false) {
    Object.defineProperty(Highlighter.prototype, "attributes", {
      get: function() {

        const model = view.model;
        const color = model.getStartNode().prop("data/settings/parameters/color");
        const { h, s, l } = hexToHSL(color);
        const opacity = persistent ? 1 : 0.4;

        return {
          ...BaseHighlighter.prototype.attributes,
          stroke: `hsl(${h}, ${s}%, ${l}%, ${opacity})`,
        };
      }
    });

    BaseHighlighter.highlight.call(this, view, persistent);
  }
});
