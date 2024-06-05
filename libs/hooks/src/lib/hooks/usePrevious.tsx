import { useEffect, useRef } from 'react';

export const usePrevious = (
  value: string | number | null | boolean | undefined
) => {
  const ref: any = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
