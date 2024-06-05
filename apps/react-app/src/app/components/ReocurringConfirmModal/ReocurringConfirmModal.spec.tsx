import { cleanup } from '@testing-library/react';

import ReocurringConfirmModal from './ReocurringConfirmModal';
import * as PaymentContextModule from '../PaymentContainer/PaymentContainer';
import * as TaskBoxContextModule from '../../pages/TaskBox/TaskBox';
import { render } from '../../helpers/render';

describe('ReocurringConfirmModal', () => {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(
      <ReocurringConfirmModal
        open={false}
        onConfirm={vi.fn()}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
