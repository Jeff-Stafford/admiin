import { render } from '@testing-library/react';

import { S3ListItem } from './S3ListItem';

describe('S3ListItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<S3ListItem primary="" />);
    expect(baseElement).toBeTruthy();
  });
});
