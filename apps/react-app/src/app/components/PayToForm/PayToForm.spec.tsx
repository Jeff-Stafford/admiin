import { render } from '../../helpers/render';
import PayToForm from './PayToForm';
import { PayToAgreement } from '@admiin-com/ds-graphql';
import * as useTaskBoxContextModule from '../../pages/TaskBox/TaskBox';
import * as PaymentContextModule from '../PaymentContainer/PaymentContainer';

import { cleanup } from '@testing-library/react';

describe('PayToForm', () => {
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
      <PayToForm
        onSuccess={function (status: PayToAgreement[]): void {
          throw new Error('Function not implemented.');
        }}
        onFailed={function (type: 'CC' | 'PayID'): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
