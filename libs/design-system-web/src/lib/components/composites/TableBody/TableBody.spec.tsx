import { render } from '@testing-library/react';

import { TableBody } from './TableBody';

describe('TableBody', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TableBody />);
    expect(baseElement).toBeTruthy();
  });
});
