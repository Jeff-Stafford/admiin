import { cleanup, render } from '@testing-library/react';

import TaskInstallmentsTimeline from './TaskInstallmentsTimeline';
import * as PaymentContextModule from '../PaymentContainer/PaymentContainer';

describe('TaskInstallmentsTimeline', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(PaymentContextModule, 'usePaymentContext').mockImplementation(
      () => ({
        updatePayment: vi.fn(),
        paymentDetails: [],
        paymentMethod: {},
        setPaymentMethod: vi.fn(),
        setPaymentAPIStatus: vi.fn(),
      })
    );
    vi.spyOn(
      PaymentContextModule,
      'usePaymentContextDetail'
    ).mockImplementation(() => ({
      updatePayment: vi.fn(),
      paymentDetails: [],
      paymentMethod: {},
      setPaymentMethod: vi.fn(),
      setPaymentAPIStatus: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TaskInstallmentsTimeline payments={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
