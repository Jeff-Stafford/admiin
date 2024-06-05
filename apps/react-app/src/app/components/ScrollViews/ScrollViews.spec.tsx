import { render } from '@testing-library/react';
import { ScrollViews, ScrollViewsContainer } from './ScrollViews';
import { ReactNode } from 'react';

describe('ScrollViews', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ScrollViewsContainer data={[]}>
        <ScrollViews
          render={function (data: any): ReactNode {
            throw new Error('Function not implemented.');
          }}
          size={'sm'}
        />
      </ScrollViewsContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
