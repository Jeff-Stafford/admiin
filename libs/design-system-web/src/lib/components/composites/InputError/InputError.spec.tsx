import { render } from '@testing-library/react';

import { InputError } from './InputError';

describe('InputError', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<InputError helperText="Input error" />);
    expect(baseElement).toBeTruthy();
  });
});
