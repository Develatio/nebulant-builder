import { util } from "@joint/core";
import { CliConnectorStates } from "@src/core/CliConnector";

export const highlightOne = function(model, opts = {}) {
  opts = util.merge({}, { persistent: false, caller: "" }, opts);

  // We don't want to highlight cells while the CLI is running
  if(
    this.runtime.get("objects.cliConnector").state < CliConnectorStates.running ||
    (
      this.runtime.get("objects.cliConnector").state >= CliConnectorStates.running &&
      opts.caller == "cli"
    )
  ) {
    const cellView = model.findView(this);
    const highlighter = cellView.model.prop("highlighter");
    // There might be widgets that don't have a highlighter or that were already
    // highlighted in some other way (hover vs select)

    // We don't want to do anything if the cell doesn't have a highlighter
    if(!highlighter) {
      return;
    }

    // If the cell is highlighted persistently, we shouldn't either attempt to
    // unhighlight it or highlight it again with the new opts
    if(highlighter.isHighlightedPersistently(cellView)) {
      return;
    }

    // If, on the other hand, the cell is highlighted without persistency, then
    // we want to unhighlight it in order to remove all highlight classes...
    if(highlighter.isHighlighted(cellView)) {
      this.unHighlightOne(model);
    }

    // ... and then highlight it with the new opts
    highlighter.highlight(cellView, opts.persistent);
  }
}
