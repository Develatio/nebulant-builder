export const removeToolsFromOne = function(model) {
  const cellView = model.findView(this);
  // We might not get a cellView if the cell was visually removed from the
  // engine. It's ok, we just ignore it since the "selection" collection
  // will be reset anyways.
  if(cellView) {
    cellView.removeTools();

    // After removing all the tools, we want to add back the warning / error
    // messages, but only if we're dealing with a node
    if(!model.isLink()) {
      this.addToolsToOne(cellView);
    }
  }
}
