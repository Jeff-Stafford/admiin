import { cleanup } from '@testing-library/react';
import { render } from '@testing-library/react';
import TaskBadge from './TaskBadge';
import * as TaskPropertyModule from '../../hooks/useTaskProperty/useTaskProperty';

describe('TaskBadge', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(TaskPropertyModule, 'useTaskProperty').mockImplementation(() => ({
      isPaid: false,
      isScheduled: false,
      dueDate: 0,
      totalInstallments: 0,
      isPayment: false,
      paidInstallments: 0,
      scheduledDate: 0,
      isInstallments: false,
      remainedAmount: 0,
      scheduledAt: new Date(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TaskBadge task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
