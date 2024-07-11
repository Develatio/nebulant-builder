export const cell_pointerdown = function(cellView, _evt, _x, _y) {
  // https://github.com/clientIO/joint/issues/1425
  if(cellView.model.isLink()) {
    this.options.gridSize = 1;
  } else {
    if(this.gconfig.get("ui.grid.snap")) {
      this.options.gridSize = this.gconfig.get("ui.grid.size");
    } else {
      this.options.gridSize = 1;
    }
  }
}
