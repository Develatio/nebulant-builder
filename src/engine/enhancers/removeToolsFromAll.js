export const removeToolsFromAll = function(models) {
  if(models) {
    models.forEach(model => this.removeToolsFromOne(model));
  } else {
    const models = this.model.getCells();
    this.removeToolsFromAll(models);
  }
}
