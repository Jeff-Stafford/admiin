import { render } from '@testing-library/react';

import SignUpXero from './SignUpXero';

describe('SignUpXero', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SignUpXero />);
    expect(baseElement).toBeTruthy();
  });
});
