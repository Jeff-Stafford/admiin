import { render } from '@testing-library/react';

import { S3Image } from './S3Image';

describe('S3Image', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<S3Image />);
    expect(baseElement).toBeTruthy();
  });
});
