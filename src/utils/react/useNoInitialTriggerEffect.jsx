import { useEffect, useRef } from 'react';

export const useNoInitialTriggerEffect = (effect, deps) => {
  const isInitialRender = useRef(true);

  useEffect(() => {
    if(isInitialRender.current) {
      // Skip the effect on the initial render
      isInitialRender.current = false;
    } else {
      // Execute the effect for subsequent renders
      const cleanupResult = effect();

      // Run cleanup on unmount or before the next effect run
      return () => {
        if(typeof cleanupResult === 'function') {
          cleanupResult();
        }
      };
    }
  }, deps);
}
