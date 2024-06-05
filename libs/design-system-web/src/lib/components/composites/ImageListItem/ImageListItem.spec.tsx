import { render } from '@testing-library/react';

import { ImageListItem } from './ImageListItem';

describe('ImageListItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ImageListItem />);
    expect(baseElement).toBeTruthy();
  });
});
