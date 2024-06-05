import { render } from '@testing-library/react';

import { S3CardMedia } from './S3CardMedia';

describe('S3CardMedia', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<S3CardMedia />);
    expect(baseElement).toBeTruthy();
  });
});
