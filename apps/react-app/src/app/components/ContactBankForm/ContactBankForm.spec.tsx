import { render } from '@testing-library/react';

import ContactBankForm from './ContactBankForm';

describe('ContactBankForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContactBankForm />);
    expect(baseElement).toBeTruthy();
  });
});
