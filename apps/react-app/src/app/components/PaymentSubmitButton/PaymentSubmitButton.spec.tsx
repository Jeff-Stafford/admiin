import { cleanup } from '@testing-library/react';
import * as PaymentContextModule from '../PaymentContainer/PaymentContainer';
import * as useTaskBoxContextModule from '../../pages/TaskBox/TaskBox';

import PaymentSubmitButton from './PaymentSubmitButton';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '../../helpers/render';

describe('PaymentSubmitButton', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(PaymentContextModule, 'usePaymentContext').mockImplementation(
      () => ({
        updatePayment: vi.fn(),
        paymentDetails: {},
        paymentMethod: {},
        bankPaymentMethod: {},
        setBankPaymentMethod: vi.fn(),
        setPaymentMethod: vi.fn(),
      })
    );
    vi.spyOn(
      PaymentContextModule,
      'usePaymentContextDetail'
    ).mockImplementation(() => ({
      taskPaymentSubmit: vi.fn(),
    }));
    vi.spyOn(useTaskBoxContextModule, 'useTaskBoxContext').mockImplementation(
      () => ({
        pdfSignatureRef: {},
        selectedSignatureKey: '',
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <PaymentSubmitButton tasks={[]} task={null} />
      </MockedProvider>
    );
    expect(baseElement).toBeTruthy();
  });
});
