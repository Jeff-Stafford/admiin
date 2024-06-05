import { cleanup } from '@testing-library/react';

import PayIdForm from './PayIdForm';
import * as useTaskBoxContextModule from '../../pages/TaskBox/TaskBox';
import * as PaymentContextModule from '../PaymentContainer/PaymentContainer';
import { render } from '../../helpers/render';

describe('PayIdForm', () => {
  beforeEach(() => {
    vi.spyOn(useTaskBoxContextModule, 'useTaskBoxContext').mockImplementation(
      () => ({
        selectedTasks: [],
        multiSelect: vi.fn(),
        setMultiShow: vi.fn(),
        selectedTask: null,
        setSelectedTask: vi.fn(),
        getBillPayments: vi.fn(),
      })
    );

    vi.spyOn(PaymentContextModule, 'usePaymentContext').mockImplementation(
      () => ({
        updatePayment: vi.fn(),
        paymentDetails: [],
        paymentMethod: {},
        setPaymentMethod: vi.fn(),
        setPaymentAPIStatus: vi.fn(),
        getBillPayments: vi.fn(),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(
      <PayIdForm
        onSuccess={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
