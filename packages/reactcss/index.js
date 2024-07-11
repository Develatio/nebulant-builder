import flattenNames from "./flattenNames";
import mergeClasses from "./mergeClasses";
import autoprefix from "./autoprefix";

export { hover } from "./components/hover";
export { default as handleHover } from "./components/hover";
export { default as handleActive } from "./components/active";
export { default as loop } from "./loop";

export const ReactCSS = (classes, ...activations) => {
  const activeNames = flattenNames(activations);
  const merged = mergeClasses(classes, activeNames);
  return autoprefix(merged);
}

export default ReactCSS;
