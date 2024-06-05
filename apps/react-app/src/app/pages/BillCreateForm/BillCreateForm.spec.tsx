import React from 'react';
import { BillCreateForm } from './BillCreateForm';
import { cleanup, waitFor } from '@testing-library/react';
import * as TaskCreationContextModule from '../../pages/TaskCreation/TaskCreation'; // Adjust the import path as necessary
import { vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';
import { render } from '../../helpers/render';

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

describe('BillCreateForm', () => {
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

  it('should render successfully', async () => {
    const { baseElement } = render(
      <TestWrapper>
        <BillCreateForm />
      </TestWrapper>
    );
    // Add more specific assertions here
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
