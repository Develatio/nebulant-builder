export const element_pointerdblclick = function(elementView, _evt) {
  const { model } = elementView;

  if(model.isGroup()) {
    model.toggle();
  } else {
    this.runtime.get("objects.blueprintAction").openNodeSettings(model.id);
  }
}
