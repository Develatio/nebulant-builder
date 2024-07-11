import { mergeWith } from "lodash-es";

const mergeArrays = (a, b) => {
  if(Array.isArray(a)) {
    return a.concat(b);
  }
}

// same as lodash's "merge", but it will also merge arrays
export const mergeWithArrays = (object, secondObject) => {
  return mergeWith(object, secondObject, mergeArrays);
}
