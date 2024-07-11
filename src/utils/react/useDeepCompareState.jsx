import { useState } from "react";
import { util } from "@joint/core";

// When set* is called, the value will be persisted only if it's different than
// the current value
export const useDeepCompareState = (initialValue) => {
  const [state, _setState] = useState(initialValue);

  const setState = (newValue) => {

    _setState(prevValue => {
      if(util.isEqual(prevValue, newValue)) {
        return prevValue;
      } else {
        return newValue;
      }
    });
  }

  return [state, setState];
}
