import PaymentInstallmentModal from './PaymentInstallmentModal';
import * as TaskCreationContextModule from '../TaskCreation/TaskCreation';
import { render } from '../../helpers/render';

describe('PaymentInstallmentModal', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(
      TaskCreationContextModule,
      'useTaskCreationContext'
    ).mockImplementation(() => ({
      showUpload: vi.fn(),
      setShowUpload: vi.fn(),
      setPage: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should render successfully', () => {
    const { baseElement } = render(
      <PaymentInstallmentModal
        open={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        onSuccess={function (date: number): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
