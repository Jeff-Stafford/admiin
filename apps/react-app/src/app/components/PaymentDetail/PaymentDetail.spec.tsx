import { cleanup } from '@testing-library/react';
import * as PaymentContextModule from '../PaymentContainer/PaymentContainer';
import * as TaskBoxContextModule from '../../pages/TaskBox/TaskBox';

import PaymentDetail from './PaymentDetail';
import { render } from '../../helpers/render';

describe('PaymentDetail', () => {
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
    vi.spyOn(TaskBoxContextModule, 'useTaskBoxContext').mockImplementation(
      () => ({ isListView: true })
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
      isListView: false,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(
      <PaymentDetail task={null} type={'Signature'} children={undefined} />
    );
    expect(baseElement).toBeTruthy();
  });
});
