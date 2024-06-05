import { render, cleanup } from '@testing-library/react';
import * as TaskCreationContextModule from '../../pages/TaskCreation/TaskCreation'; // Adjust the import path as necessary
import { vi } from 'vitest';

import BillDirection from './BillDirection';
import React from 'react';

describe('BillDirection', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(
      TaskCreationContextModule,
      'useTaskCreationContext'
    ).mockImplementation(() => ({
      loading: false,
      saved: false,
      submitted: false,
      page: null,
      createError: {},
      handleSave: vi.fn(),
      showUpload: true,
      setShowUpload: vi.fn(),
      setPage: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });
  it('should render successfully', () => {
    const { baseElement } = render(<BillDirection />);
    expect(baseElement).toBeTruthy();
  });
});
