import { useState } from "react";
import { util } from "@joint/core";
import { mapKeys } from "lodash-es";
import { mapValues } from "lodash-es";
import { isEqualWith } from "lodash-es";

const deepSortArrays = (obj) => {
  if (Array.isArray(obj)) {
    return util.sortBy(obj.map(deepSortArrays));
  } else if (util.isPlainObject(obj)) {
    return mapValues(mapKeys(obj, (_v, k) => k), deepSortArrays);
  } else {
    return obj;
  }
};

const comparator = (objValue, othValue) => {
  if (Array.isArray(objValue) && Array.isArray(othValue)) {
    // If both are arrays, compare them ignoring the order of primitives
    return util.isEqual(deepSortArrays(objValue), deepSortArrays(othValue));
  }
  // Returning undefined will let lodash use its default comparison
};

// When set* is called, the value will be persisted only if it's different than
// the current value. Differences in the order of arrays will be ignored
export const useDeepUnorderedCompareState = (initialValue) => {
  const [state, _setState] = useState(initialValue);

  const setState = (newValue) => {

    _setState(prevValue => {
      if(isEqualWith(prevValue, newValue, comparator)) {
        return prevValue;
      } else {
        return newValue;
      }
    });
  }

  return [state, setState];
}
