import React from 'react';
import { BillSummary } from './BillSummary';
import { render } from '../../helpers/render';
import * as TaskCreationContextModule from '../../pages/TaskCreation/TaskCreation'; // Adjust the import path as necessary
import { FormProvider, useForm } from 'react-hook-form';
import { vi } from 'vitest';
import { waitFor } from '@testing-library/react';

vi.mock('react-hook-form', async () => {
  const actual: any = await vi.importActual('react-hook-form'); // Import the actual module
  // Create a mock Controller component
  return {
    ...actual, // Spread all actual exports
    useFormContext: () => ({
      ...actual.useFormContext(),
      control: {
        ...actual.useForm().control,
        register: vi.fn(),
        unregister: vi.fn(),
        getValues: vi.fn(),
      },
      handleSubmit: vi.fn(),
      trigger: vi.fn(),
      formState: { errors: {} },
      setValue: vi.fn(),
    }),
    useWatch: () => ({
      type: 'SIGN_ONLY',
    }),
    Controller: actual.Controller, // Use the mocked Controller
  };
});

const TestWrapper = ({ children }: { children: any }) => {
  const methods = useForm<TaskCreationContextModule.BillCreateFormData>(); // useForm provides the necessary form context
  return <FormProvider {...methods}>{children}</FormProvider>;
};
describe('BillSummary', () => {
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
    const { baseElement } = render(<BillSummary />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
