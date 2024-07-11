export const paper_pinch = function(_evt, x, y, scale) {
  const zoom = this.scroller.zoom();
  this.scroller.zoom(zoom * scale, {
    min: 0.2,
    max: 2.0,
    ox: x,
    oy: y,
    absolute: true,
  });
}
