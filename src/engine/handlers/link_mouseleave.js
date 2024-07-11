export const link_mouseleave = function(linkView) {
  const { model } = linkView;

  // We don't want to unhighlight the element if it's selected
  if(this.selection.collection.get(model)) {
    return;
  }

  this.unHighlightOne(model);
}
