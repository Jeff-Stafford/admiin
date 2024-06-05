import { useState, useEffect, useRef, MutableRefObject } from 'react';

// Define types for the hook's return value
interface Dimensions {
  width: number;
  height: number;
}

// Custom hook to observe resize events
function useResizeObserver(): [
  MutableRefObject<null | HTMLElement>,
  Dimensions
] {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => {
      if (observeTarget) {
        resizeObserver.unobserve(observeTarget);
      }
    };
  }, [ref]); // Only re-run if ref changes

  return [ref, dimensions];
}

export default useResizeObserver;
