import { render } from '@testing-library/react';

import { Image } from './Image';

describe('Image', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Image src="" />);
    expect(baseElement).toBeTruthy();
  });
});
