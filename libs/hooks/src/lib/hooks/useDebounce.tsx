import { useState, useEffect } from 'react';

// useDebounce hook
export const useDebounce = (value: string, delay: number) => {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set debouncedValue to value (input value) after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time useEffect
      // is re-called. useEffect will only be re-called if value or delay changes
      // (see the inputs array below). This is how we prevent multiple setTimeouts from being created.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value or delay changes
    [value, delay]
  );

  return debouncedValue;
};
