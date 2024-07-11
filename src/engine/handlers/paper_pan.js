export const paper_pan = function(evt, deltaX, deltaY) {
  evt.originalEvent.preventDefault();
  this.scroller.el.scrollLeft += deltaX;
  this.scroller.el.scrollTop += deltaY;
}
