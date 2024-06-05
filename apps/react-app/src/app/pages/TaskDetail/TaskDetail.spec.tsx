import { cleanup } from '@admiin-com/ds-web-testing-utils';
import { TaskDetail } from './TaskDetail';
import { render } from '../../helpers/render';
import * as TaskBoxContextModule from '../TaskBox/TaskBox';
import * as PaymentContextModule from '../../components/PaymentContainer/PaymentContainer';
import * as DsCommonModule from '@admiin-com/ds-common';
describe('TaskDetail', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(TaskBoxContextModule, 'useTaskBoxContext').mockImplementation(
      () => ({
        selectedTask: {},
        loadingTask: false,
      })
    );
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
    vi.spyOn(DsCommonModule, 'frontDateFromBackendDate').mockImplementation(
      (str: string) => '2024-2-2'
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', async () => {
    const { baseElement } = render(<TaskDetail />);
    // await waitFor(() => {
    expect(baseElement).toBeTruthy();
    // });
  });
});
