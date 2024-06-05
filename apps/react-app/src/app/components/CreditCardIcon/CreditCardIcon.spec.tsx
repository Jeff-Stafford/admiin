import { render } from '@testing-library/react';

import CreditCardIcon from './CreditCardIcon';

describe('CreditCardIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreditCardIcon type={'visa'} />);
    expect(baseElement).toBeTruthy();
  });
});
