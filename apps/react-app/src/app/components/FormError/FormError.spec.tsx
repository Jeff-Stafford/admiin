import { render } from '@testing-library/react';

import { FormError } from './FormError';

describe('FormError', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FormError />);
    expect(baseElement).toBeTruthy();
  });
});
