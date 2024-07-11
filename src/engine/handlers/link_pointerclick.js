export const link_pointerclick = function(linkView, evt) {
  // When a single link is clicked (with no CTRL / Meta keys)
  // we want to deselect everything and then select only the
  // link that was clicked
  if(!evt.ctrlKey && !evt.metaKey) {
    this.removeToolsFromAll(this.selection.collection.models);
    this.unHighlightAll(this.selection.collection.models);

    this.addToolsToOne(linkView)
    this.selection.collection.reset([linkView.model]);
  }

  // When a single link is clicked while holding CTRL / Meta keys
  // we want to add it to the selection collection ... or remove it from
  // the selection collection if it's already there
  else if(evt.ctrlKey || evt.metaKey) {
    if(this.selection.collection.get(linkView.model)) {
      this.selection.collection.remove(linkView.model);
    } else {
      this.selection.collection.add(linkView.model);
    }
  }
}
