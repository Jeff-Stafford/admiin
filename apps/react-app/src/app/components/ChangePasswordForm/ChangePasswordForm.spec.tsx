import { render } from '@testing-library/react';

import ChangePasswordForm from './ChangePasswordForm';

describe('ChangePasswordForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ChangePasswordForm />);
    expect(baseElement).toBeTruthy();
  });
});
