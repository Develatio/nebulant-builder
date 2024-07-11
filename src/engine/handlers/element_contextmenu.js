export const element_contextmenu = function(elementView, _evt) {
  if(!this.gconfig.get("advanced.debug")) {
    this.runtime.get("objects.blueprintAction").openNodeSettings(elementView.model.id);
  }
}
