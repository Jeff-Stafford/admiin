import { cleanup } from '@testing-library/react';

import TasksView from './TasksView';
import * as PaymentContextModule from '../../components/PaymentContainer/PaymentContainer';
import { render } from '../../helpers/render';
import * as TaskBoxContextModule from '../../pages/TaskBox/TaskBox';

describe('TasksView', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(PaymentContextModule, 'usePaymentContext').mockImplementation(
      () => ({
        updatePayment: vi.fn(),
        paymentDetails: [],
        paymentMethod: {},
        setPaymentAPIStatus: vi.fn(),
        setPaymentMethod: vi.fn(),
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
      setPaymentAPIStatus: vi.fn(),
      setPaymentMethod: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TasksView tasks={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
