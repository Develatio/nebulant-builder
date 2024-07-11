// Return a deep-copy of the passed object. Try to use structuredClone if
// available; fallback to JSON.parse + JSON.stringify
export const clone = (obj) => {
  if(window.structuredClone) {
    return structuredClone(obj);
  } else {
    return JSON.stringify(JSON.parse(obj));
  }
}
