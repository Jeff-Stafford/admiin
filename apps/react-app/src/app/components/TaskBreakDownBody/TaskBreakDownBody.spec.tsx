import { cleanup, render } from '@testing-library/react';
import * as PaymentContextModule from '../PaymentContainer/PaymentContainer';

import TaskBreakDownBody from './TaskBreakDownBody';

describe('TaskBreakDownBody', () => {
  beforeEach(() => {
    vi.spyOn(PaymentContextModule, 'usePaymentContext').mockImplementation(
      () => ({
        updatePayment: vi.fn(),
        paymentDetails: [],
        paymentMethod: {},
        setPaymentMethod: vi.fn(),
        setPaymentAPIStatus: vi.fn(),
        getFees: vi.fn(() => ({ fees: [] })),
        getBillPayments: vi.fn(),
      })
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TaskBreakDownBody task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
