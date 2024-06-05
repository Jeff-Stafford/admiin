import React, { useRef, useCallback, useEffect } from 'react';

interface UseInfiniteScrollProps {
  fetchMore?: () => void;
  loading: boolean;
  hasNextPage: boolean;
}

export const useInfiniteScroll = ({
  fetchMore,
  loading,
  hasNextPage,
}: UseInfiniteScrollProps) => {
  const observer = useRef<IntersectionObserver | null>(null);

  const lastElementRef = useCallback(
    (node: any) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchMore && fetchMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasNextPage, fetchMore]
  );

  useEffect(() => {
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return lastElementRef;
};
