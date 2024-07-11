const fdivide = (a, b) => parseFloat((a / b).toFixed(12));
const fmultiply = (a, b) => parseFloat((a * b).toFixed(12));
const fsum = (a, b) => parseFloat((a + b).toFixed(12));

const rescale = (zoom) => {
  // V = value to be converted
  // R1 = differential value for OLD range (max - min)
  // R2 = differential value for NEW range (max - min)
  // M1 = min value OLD range
  // M2 = min value NEW range

  // (V - M1) * R2 / R1 + M2

  let OLD_MIN, OLD_MAX, NEW_MIN, NEW_MAX;

  if(zoom >= 1) {
    OLD_MIN = 1;
    OLD_MAX = 2;
    NEW_MIN = 1;
    NEW_MAX = 0.7;
  } else if(zoom >= 0.6) {
    OLD_MIN = 0.6;
    OLD_MAX = 1;
    NEW_MIN = 2;
    NEW_MAX = 1;
  } else {
    OLD_MIN = 0.2;
    OLD_MAX = 0.6;
    NEW_MIN = 4;
    NEW_MAX = 2;
  }

  const R1 = OLD_MAX - OLD_MIN;
  const R2 = NEW_MAX - NEW_MIN;
  const M1 = OLD_MIN;
  const M2 = NEW_MIN;

  // We could do it this way, but that will make the operation imprecise
  //return (zoom - M1) * R2 / R1 + M2;

  const step1 = fmultiply((zoom - M1), R2);
  const step2 = fdivide(step1, R1);
  const step3 = fsum(step2, M2);

  return step3;
}

export const addToolsToOne = function(elementView) {
  // Convert zoom to scale. Zoom is a value that goes from 0.2 to 2.0, being "1"
  // the default value. The more the user zooms in, the bigger the zoom value
  // is. The bigger the zoom value is, the smaller the scale value should be.
  // That's because when the user zooms in, we want the tools to look smaller.
  // const engine = elementView.paper;
  // const zoom = engine.scroller.zoom();
  // const scale = rescale(zoom);

  // Actually, no. We don't want to do any of that because that makes the UI
  // kind of weird to use. Also, there is some sort of
  const scale = 1;

  const model = elementView.model;
  model.addTools({ elementView, scale });
}
