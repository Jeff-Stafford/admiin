import { render, cleanup } from '@testing-library/react';

import { TaskItem } from './TaskItem';
import * as useContactModule from '../../hooks/useContact/useContact';
describe('TaskItem', () => {
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
    const { baseElement } = render(<TaskItem task={null} />);
    expect(baseElement).toBeTruthy();
  });
});
