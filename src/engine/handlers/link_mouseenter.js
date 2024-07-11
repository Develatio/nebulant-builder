export const link_mouseenter = function(linkView) {
  const { model } = linkView;

  if(this.gconfig.get("ui.highlight_onhover")) {
    this.highlightOne(model);
  }
}
