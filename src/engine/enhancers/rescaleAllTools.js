export const rescaleAllTools = function() {
  this.model.getLinks().forEach((link) => {
    const linkView = link.findView(this);
    if(linkView.hasTools()) {
      this.addToolsToOne(linkView);
    }
  });

  this.model.getElements().forEach((element) => {
    const elementView = element.findView(this);
    if(elementView.hasTools()) {
      this.addToolsToOne(elementView);
    }
  });
}
