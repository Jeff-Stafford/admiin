import { render } from '@testing-library/react';

import ResetPasswordForm from './ResetPasswordForm';

describe('ResetPasswordForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResetPasswordForm />);
    expect(baseElement).toBeTruthy();
  });
});
