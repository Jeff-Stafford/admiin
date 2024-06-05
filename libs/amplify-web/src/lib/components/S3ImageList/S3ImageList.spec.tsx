import { render } from '@testing-library/react';

import { S3ImageList } from './S3ImageList';

describe('S3ImageList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<S3ImageList images={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
