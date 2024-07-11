import { useState, useEffect } from "react";

export const usePromiseValue = (promise, initialValue) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    promise.then(setValue).catch(() => {});
  }, []);

  return value;
}
