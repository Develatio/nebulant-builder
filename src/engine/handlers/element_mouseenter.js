export const element_mouseenter = function(elementView) {
  if(this.gconfig.get("ui.highlight_onhover")) {
    this.highlightOne(elementView.model);
  }
}
