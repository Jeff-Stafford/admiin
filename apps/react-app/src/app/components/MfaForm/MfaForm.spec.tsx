import { render, waitFor } from '@testing-library/react';

import MfaForm from './MfaForm';

describe('MfaForm', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<MfaForm />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
