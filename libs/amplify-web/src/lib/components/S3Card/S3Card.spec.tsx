import { render } from '@testing-library/react';

import { S3Card } from './S3Card';

describe('S3Card', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<S3Card />);
    expect(baseElement).toBeTruthy();
  });
});
