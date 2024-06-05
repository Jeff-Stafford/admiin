import { render } from '@testing-library/react';

import { TableHead } from './TableHead';

describe('TableHead', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TableHead />);
    expect(baseElement).toBeTruthy();
  });
});
