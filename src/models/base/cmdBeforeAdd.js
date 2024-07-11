import { util } from "@joint/core";

export function cmdBeforeAdd(cmdName, cell, _graph, options) {
  // Exclude more events?
  // console.log({ cmdName, cell, _graph, options });

  // We don't want to store in the undo/redo store the following things:
  if(options?.skip_undo_stack == true) {
    return false;
  }

  // If we got through here, we'll most probably need the "propertyPath".
  // .attr() can be called with either a <string> or an <object>. If a
  // <string> was used, then "propertyPath" will be that <string>, but if
  // an <object> was used, then "propertyPath" will be null and we'll need
  // to flatten the "propertyValue" in order to find out which props where
  // changed.
  if(options?.propertyPath === null) {
    options.propertyPath = Object.keys(
      util.flattenObject(options?.propertyValue, "/")
    );
  } else {
    options.propertyPath = [options?.propertyPath];
  }

  const ctype = cell?.attributes?.type;
  if(ctype && ctype.startsWith("nebulant.link")) {
    if(
      cmdName == "change:attrs" &&
      options.propertyPath.includes("attrs/line/stroke")
    ) {
      return false;
    }
  }

  // Avoid "change:z" on nodes if nothing changed visually
  if(ctype && ctype.startsWith("nebulant.") && !cell.isLink()) {
    if(cmdName == "change:z") {
      const engine = this.runtime.get("objects.engine");
      let nodes = engine.findViewsInArea(cell.getBBox()) || [];
      nodes = nodes.filter(view => view.model.id !== cell.id);

      if(engine.hasEngineLayers()) {
        const group = engine.getCurrentEngineLayer();
        nodes = nodes.filter(model => model.getParentCell()?.id === group.id);
      }

      if(nodes.length === 0) {
        return false;
      }
    }
  }

  // change:zoom
  // When the canvas is being zoomed in/out
  //
  // change:x || change:y
  // When the scroller is being moved by the user
  if([
    "change:zoom",
    "change:x",
    "change:y",
  ].includes(cmdName)) {
    return false;
  }

  return true;
}
