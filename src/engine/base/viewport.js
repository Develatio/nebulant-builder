export const viewport = function(view) {
  var element = view.model;

  if(!element) return true;

  // We received a Backbone.Collection for some reason. Not sure why...
  if(!element.isLink && !element.isGroup && !element.isElement) return true;

  if(this.hasEngineLayers()) {
    // If there are layers, get the latest layer and show the element only
    // if it belongs to the group of that layer
    const group = this.getCurrentEngineLayer();

    if(element.isLink()) {
      // We want to hide the links that connect the group itself with the
      // "Start" node...
      const source = element.source();
      if(source.id == group.id) return false;

      // ... or the "End" node.
      const target = element.target();
      if(target.id == group.id) return false;

      // This is a link that doesn't have a target cell, which means that
      // the user is currently creating it. We should always render it.
      if(!target.id) return true;

      // There is a moment in the link creation in which it has boh source
      // and target cells, but it hasn't been reparented, which means that
      // it doesn't belong to this group. If this is the case, we consider
      // the link to be "not fully created", and thus we render it.
      if(element.prop("_not_fully_created")) return true;

      // Maybe the link's target is a "Start" node, which means that the
      // link is connected to a group that is embedded in this group.
      // We want to hide it.
      const targetCell = element.getTargetCell();
      if(targetCell.prop("type").includes("executionControl.Start")) return false;

      // Same if the link's source is an "End" node.
      const sourceCell = element.getSourceCell();
      if(sourceCell.prop("type").includes("executionControl.End")) return false;
    }

    return group.contains(element.id, false);
  } else {
    // If there are no layers, hide the element only if it has a parent
    if(element.parent) {
      return !element.parent();
    } else {
      return true;
    }
  }
}
