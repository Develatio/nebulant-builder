import { dia, highlighters } from "@joint/core";
import { GConfig } from "@src/core/GConfig";

const H_STROKE_ID = "element-highlighter";
const H_CLASS_ID = "element-highlighter-class";

export const Highlighter = dia.HighlighterView.extend({
  attributes: {
    padding: 4,
    rx: 5,
    ry: 5,
  },
}, {
  highlight(view, persistent = false) {
    const {
      padding,
      rx,
      ry,
      stroke,
    } = this.prototype.attributes;

    highlighters.stroke.add(view, "root", H_STROKE_ID, {
      padding,
      rx,
      ry,
      attrs: {
        ...(stroke != undefined && { stroke }),
      },
    });

    const gconfig = new GConfig();
    const cls_animated = gconfig.get("ui.highlight_animations") ? "highlighted-animated" : "";
    const cls_persistent = persistent ? "highlighted-persistent" : "highlighted";

    highlighters.addClass.add(view, "root", H_CLASS_ID, {
      className: `${cls_animated} ${cls_persistent}`.trim(),
    });
  },

  unhighlight(view) {
    highlighters.stroke.remove(view, H_STROKE_ID);
    highlighters.addClass.remove(view, H_CLASS_ID);
  },

  isHighlightedPersistently(view) {
    const el = highlighters.stroke.get(view, H_STROKE_ID);
    return el?.node?.classList.contains("highlighted-persistent");
  },

  isHighlighted(view) {
    return !!highlighters.stroke.get(view, H_STROKE_ID);
  },

  // ###########################################################################

  pulseHighlight(view) {
    view.el.classList.add("pulse-highlight");
  },

  pulseUnhighlight(view) {
    view.el.classList.remove("pulse-highlight");
  },

  isPulseHighlighted(view) {
    return view.el.classList.contains("pulse-highlight");
  }
});
