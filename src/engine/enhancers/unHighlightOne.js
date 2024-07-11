import { util } from "@joint/core";
import { CliConnectorStates } from "@src/core/CliConnector";

export const unHighlightOne = function(model, opts = { caller: "" }) {
  opts = util.merge({}, { caller: "" }, opts);

  // We don't want to unhighlight cells while the CLI is running
  if(
    this.runtime.get("objects.cliConnector").state < CliConnectorStates.running ||
    (
      this.runtime.get("objects.cliConnector").state >= CliConnectorStates.running &&
      opts.caller == "cli"
    )
  ) {
    const cellView = model.findView(this);
    // We might not get a cellView if the cell was visually removed from the
    // engine. It's ok, we just ignore it since the "selection" collection
    // will be reset anyways.
    if(cellView) {
      const highlighter = model.prop("highlighter");

      // There might be widgets that don't have a highlighter
      if(!highlighter) {
        return;
      }

      if(
          highlighter.isHighlighted(cellView) ||
          highlighter.isHighlightedPersistently(cellView)
      ) {
        highlighter.unhighlight(cellView);
      }
    }
  }
}
