import { render } from '@testing-library/react';

import NotFound from './NotFound';

describe('NotFound', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NotFound />);
    expect(baseElement).toBeTruthy();
  });
});
