import { render } from '@testing-library/react';

import TaskSummaryCard from './TaskSummaryCard';
import * as PaymentContextModule from '../../components/PaymentContainer/PaymentContainer';

describe('TaskSummaryCard', () => {
  beforeEach(() => {
    vi.spyOn(PaymentContextModule, 'usePaymentContext').mockImplementation(
      () => ({
        updatePayment: vi.fn(),
        paymentDetails: [],
        paymentMethod: {},
        setPaymentMethod: vi.fn(),
        getFees: vi.fn(() => ({ fees: [] })),
        setPaymentAPIStatus: vi.fn(),
      })
    );
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TaskSummaryCard task={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
