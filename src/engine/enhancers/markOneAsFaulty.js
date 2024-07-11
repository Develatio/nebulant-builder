export const markOneAsFaulty = function(model) {
  const cellView = model.findView(this);

  if(cellView) {
    const highlighter = model.prop("highlighter");

    if(!highlighter.isPulseHighlighted(cellView)) {
      highlighter.pulseHighlight(cellView);
    }
  }
}
