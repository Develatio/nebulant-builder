export const blank_pointerdown = function(evt) {
  // TODO: Do we want this to be configurable and maybe select instead of pan
  // when the user drag-clicks?
  if(evt.shiftKey) {
    this.selection.startSelecting(evt);
  } else {
    this.scroller.startPanning(evt);
  }
}
