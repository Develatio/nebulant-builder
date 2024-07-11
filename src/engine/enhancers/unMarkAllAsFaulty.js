export const unMarkAllAsFaulty = function(models) {
  if(models) {
    models.forEach(model => this.unMarkOneAsFaulty(model));
  } else {
    const models = this.model.getElements();
    this.unMarkAllAsFaulty(models);
  }
}
