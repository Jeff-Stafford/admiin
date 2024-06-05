import { render } from '@testing-library/react';

import { ImageListItemBar } from './ImageListItemBar';

describe('ImageListItemBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ImageListItemBar />);
    expect(baseElement).toBeTruthy();
  });
});
