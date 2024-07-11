export const link_pointerup = function(_linkView) {
  // Restore the gridSize we modified in the "cell:pointerdown" event
  this.options.gridSize = this.gconfig.get("ui.grid.size");
}
