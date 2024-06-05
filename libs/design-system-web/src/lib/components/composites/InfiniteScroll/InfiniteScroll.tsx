import { Theme } from '@mui/material';
import { SxProps } from '@mui/system/styleFunctionSx';
import { ReactNode, useEffect, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { WBTableBody } from '../../index';
import { Box } from '../../primatives/Box/Box';

export interface InfiniteScrollProps {
  items: any[];
  hasMoreItems: boolean;
  isFetching: boolean;
  fetchNextPage: () => void;
  oddRowSx?: SxProps<Theme>;
  renderItem: ({ item, index }: { item: any; index?: number }) => ReactNode;
}

export const InfiniteScroll = ({
  items,
  renderItem,
  hasMoreItems,
  isFetching,
  fetchNextPage,
  oddRowSx = {},
}: InfiniteScrollProps) => {
  const allRows = items;
  //const allRows = data ? data.pages.flatMap((d) => d.rows) : []

  const parentRef = useRef();

  const rowVirtualizer = useVirtualizer({
    count: hasMoreItems ? allRows.length + 1 : allRows.length,
    getScrollElement: () => parentRef?.current || null,
    estimateSize: () => 100,
    overscan: 5,
  });

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) {
      return;
    }

    if (lastItem.index >= allRows.length - 1 && hasMoreItems && !isFetching) {
      fetchNextPage();
    }
  }, [
    hasMoreItems,
    fetchNextPage,
    allRows.length,
    isFetching,
    rowVirtualizer.getVirtualItems(),
  ]);

  return (
    <Box
      ref={parentRef}
      sx={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}
    >
      <WBTableBody>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          console.log('virtualRow: ', virtualRow);
          const isLoaderRow = virtualRow.index > allRows.length - 1;
          const item = allRows[virtualRow.index];

          return (
            <Box
              key={virtualRow.index}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                ...(oddRowSx && virtualRow.index % 2 ? oddRowSx : {}),
              }}
            >
              {isLoaderRow
                ? hasMoreItems
                  ? 'Loading more...'
                  : 'Nothing more to load'
                : renderItem({ item, index: virtualRow.index })}
            </Box>
          );
        })}
      </WBTableBody>
    </Box>
  );
};
