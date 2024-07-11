export const element_mouseleave = function(elementView, _evt) {
  const { model } = elementView;

  // We don't want to unhighlight the element if it's selected or if the
  // CLI has marked it as "running"
  if(this.selection.collection.get(model) || model.prop("running")) {
    return;
  }

  this.unHighlightOne(elementView.model);
}
