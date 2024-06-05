import React from 'react';
import { BillSign } from './BillSign';
import { render } from '../../helpers/render';
import * as TaskCreationContextModule from '../../pages/TaskCreation/TaskCreation'; // Adjust the import path as necessary
import { vi } from 'vitest';
import { waitFor } from '@testing-library/react';

describe('BillSign', () => {
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
  it('should render successfully', async () => {
    const { baseElement } = render(<BillSign />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
