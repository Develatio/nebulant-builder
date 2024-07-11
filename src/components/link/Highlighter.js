import { dia, g, highlighters } from "@joint/core";
import { GConfig } from "@src/core/GConfig";

const H_CLASS_ID = "selected-link";

export const Highlighter = dia.HighlighterView.extend({

}, {
  highlight(view, persistent = false) {
    const gconfig = new GConfig();
    const cls_animated = gconfig.get("ui.highlight_animations") ? "highlighted-animated" : "";
    const cls_persistent = persistent ? "highlighted-persistent" : "highlighted";

    const { model } = view;

    highlighters.addClass.add(view, "line", H_CLASS_ID, {
      className: `${cls_animated} ${cls_persistent}`.trim(),
    });

    // Sometimes several links might overlap one on top of another. If that
    // happens and we're trying to highlight the link that is below another
    // link, the highlighter won't be visible. That's why we must change the
    // z-index of the link temporarily, making sure to restore it back to it's
    // original value later (on unhighlight).
    const tmp_z = model.prop("tmp_z");
    if(Number.isInteger(tmp_z)) {
      model.prop("tmp_z", model.prop("z"), { skip_undo_stack: true });
      model.toFront({ skip_undo_stack: true });
    }

    // Furthermore, if this link is on the top of other links and we try to
    // highlight it, the highlighter still won't be visible. That's because the
    // highlighter uses stroke-dasharray. Since the link that is right below
    // this link has the same color, the gaps created by the stroke-dasharray
    // are "visually filled" with the color of the link that is right below this
    // link.
    // In order to fix that, we create a new path (called "bgline") and set it's
    // stroke color to white.
    const path = g.Path(view.path.segments).serialize();
    view?.selectors?.bgline?.setAttribute?.("d", path);
    view?.selectors?.bgline?.setAttribute?.("stroke", "white");

    // If the link isn't fully created we shouldn't set the path of the
    // lineglow element since that will cause visual glitches. This can
    // happen when the link is created by clicking on a source port
    // (instead of dragging).
    if(!model.prop("_not_fully_created")) {
      view?.selectors?.lineglow?.setAttribute?.("d", path);
    }
  },

  unhighlight(view) {
    highlighters.addClass.remove(view, H_CLASS_ID);

    const { model } = view;

    // Make sure to restore the original z-index.
    const tmp_z = model.prop("tmp_z");
    if(Number.isInteger(tmp_z)) {
      model.prop("z", tmp_z, { skip_undo_stack: true });
    }

    // Make sure to restore the bgline color to transparent.
    view?.selectors?.bgline?.setAttribute?.("d", "");
    view?.selectors?.bgline?.setAttribute?.("stroke", "transparent");

    view?.selectors?.lineglow?.setAttribute?.("d", "");
  },

  isHighlightedPersistently(view) {
    const el = highlighters.addClass.get(view, H_CLASS_ID);
    return el?.node?.classList.contains("highlighted-persistent");
  },

  isHighlighted(view) {
    return !!highlighters.addClass.get(view, H_CLASS_ID);
  },
});
