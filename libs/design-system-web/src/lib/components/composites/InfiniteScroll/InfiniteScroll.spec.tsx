import { render } from '@testing-library/react';

import { InfiniteScroll } from './InfiniteScroll';

describe('InfiniteScroll', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <InfiniteScroll
        items={[{ id: '1', title: 'Item' }]}
        renderItem={(item: any) => <div key={item.title}></div>}
        hasMoreItems={false}
        isFetching={false}
        fetchNextPage={() => console.log('fetchNextPage')}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
