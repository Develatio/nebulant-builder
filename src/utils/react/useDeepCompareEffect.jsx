import { useEffect, useRef } from "react";
import { util } from "@joint/core";
import { clone } from "@src/utils/lang/clone";

function useDeepCompare(value) {
  const ref = useRef(clone(value));

  if(!util.isEqual(value, ref.current)) {
    ref.current = clone(value);
  }

  return [ref.current];
}

export function useDeepCompareEffect(callback, dependencies) {
  return useEffect(callback, useDeepCompare(dependencies));
}
