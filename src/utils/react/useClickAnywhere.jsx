import { useEffect } from "react";

export const useClickAnywhere = (fn) => {
  useEffect(() => {
    document.addEventListener("click", fn, true);

    // Run cleanup on unmount or before the next effect run
    return () => {
      document.removeEventListener("click", fn, true);
    };
  }, []);
}
