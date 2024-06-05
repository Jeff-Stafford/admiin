import { render } from '@testing-library/react';

import { PaymentDetailSelector } from './PaymentDetailSelector';

describe('PaymentDetailSelector', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PaymentDetailSelector />);
    expect(baseElement).toBeTruthy();
  });
});
