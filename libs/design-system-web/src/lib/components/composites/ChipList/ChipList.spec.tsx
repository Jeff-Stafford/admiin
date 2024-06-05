import { render } from '@testing-library/react';

import { ChipList } from './ChipList';

describe('ChipList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ChipList numTags={1} tags={['Blue', 'Red']} />
    );
    expect(baseElement).toBeTruthy();
  });
});
