import { render } from '@testing-library/react';

import TwoFactorForm from './TwoFactorForm';

describe('TwoFactorForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TwoFactorForm />);
    expect(baseElement).toBeTruthy();
  });
});
