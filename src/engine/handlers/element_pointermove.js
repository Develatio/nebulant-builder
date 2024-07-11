export const element_pointermove = function (elementView, _evt, x, y) {
  const { model } = elementView;

  // If the user has selected more than 1 element, move all of them at the
  // same time
  const cells = this.selection.collection.filter(m => !m.isLink());
  if(cells.length > 1) {
    const offset = {
      x: this.dragPoint.x - x,
      y: this.dragPoint.y - y,
    };
    this.dragPoint = {x, y};

    this.freeze();

    cells.filter(cmodel => cmodel.id != model.id).forEach(cmodel => {
      const position = cmodel.position();
      cmodel.position(position.x - offset.x, position.y - offset.y, {
        deep: true,
      });
    });

    this.unfreeze();
  }
}
