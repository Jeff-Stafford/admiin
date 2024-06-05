import { render, cleanup } from '@testing-library/react';

import { TaskCard } from './TaskCard';
import * as useContactModule from '../../hooks/useContact/useContact';
describe('TaskCard', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(useContactModule, 'useContact').mockImplementation(() => ({
      contactLoading: false,
      contact: undefined,
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<TaskCard task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
