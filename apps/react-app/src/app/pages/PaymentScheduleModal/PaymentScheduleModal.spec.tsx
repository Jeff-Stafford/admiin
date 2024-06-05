import PaymentScheduleModal from './PaymentScheduleModal';
import * as TaskCreationContextModule from '../TaskCreation/TaskCreation';
import { render } from '../../helpers/render';

describe('PaymentScheduleModal', () => {
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
      <PaymentScheduleModal
        open={false}
        handleClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        onSuccess={function (date: Date): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
