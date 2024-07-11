export const scale = function() {
  const zoom = this.scroller.zoom();
  this.model.set("zoom", zoom, { skip_undo_stack: true });
};
