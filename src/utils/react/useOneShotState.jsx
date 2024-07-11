import { useRef } from "react";

export const useOneShotState = (fn) => {
  const value = useRef(false);

  if(!value.current) {
    value.current = fn();
  }

  return value.current;
}
