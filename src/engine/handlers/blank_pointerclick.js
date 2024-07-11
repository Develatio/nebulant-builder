export const blank_pointerclick = function(_evt) {
  this.removeToolsFromAll();
  this.unHighlightAll();

  if(this.selection.collection.models.length > 0) {
    this.selection.collection.reset([]);
  }
}
