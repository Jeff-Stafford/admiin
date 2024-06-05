import { render } from '@testing-library/react';
import { S3Avatar } from './S3Avatar';

describe('S3Avatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<S3Avatar />);
    expect(baseElement).toBeTruthy();
  });
});
