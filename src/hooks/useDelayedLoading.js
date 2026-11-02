import { useEffect, useRef, useState } from 'react';

export function useDelayedLoading(isLoading, { delay = 200, minDuration = 400 } = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const shownAtRef = useRef(0);

  useEffect(() => {
    if (!isLoading) {
      if (!isVisible) return undefined;

      const elapsed = Date.now() - shownAtRef.current;
      const remaining = Math.max(0, minDuration - elapsed);
      const timer = window.setTimeout(() => setIsVisible(false), remaining);
      return () => window.clearTimeout(timer);
    }

    if (isVisible) return undefined;

    const timer = window.setTimeout(() => {
      setIsVisible(true);
      shownAtRef.current = Date.now();
    }, delay);

    return () => window.clearTimeout(timer);
  }, [delay, isLoading, isVisible, minDuration]);

  return isVisible;
}
