import { render } from '@testing-library/react';

import ErrorHandler from './ErrorHandler';

describe('ErrorHandler', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ErrorHandler />);
    expect(baseElement).toBeTruthy();
  });
});
