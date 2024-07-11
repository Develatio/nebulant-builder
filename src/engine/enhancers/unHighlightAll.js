export const unHighlightAll = function(models) {
  if(models) {
    models.forEach(model => this.unHighlightOne(model));
  } else {
    const models = this.model.getCells();
    this.unHighlightAll(models);
  }
}
