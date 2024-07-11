export const reset = function(collection) {
  this.removeToolsFromAll();
  this.unHighlightAll();

  collection.models.forEach(model => {
    this.addToolsToOne(model.findView(this));
    this.highlightOne(model, {
      persistent: true,
    });
  });
}
