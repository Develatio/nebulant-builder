export const add = function(model) {
  this.addToolsToOne(model.findView(this));
  this.highlightOne(model, {
    persistent: true,
  });
}
