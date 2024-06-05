import { render } from '../../helpers/render';
import AutoCompleteLookup from './AutoCompleteLookup';
import * as TaskCreationContextModule from '../../pages/TaskCreation/TaskCreation'; // Adjust the import path as necessary
import { cleanup } from '@testing-library/react';

describe('AutoCompleteLookup', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(
      TaskCreationContextModule,
      'useTaskCreationContext'
    ).mockImplementation(() => ({
      isClient: false,
    }));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <AutoCompleteLookup
        label={''}
        placeholder={''}
        onChange={function (): void {
          throw new Error('Function not implemented.');
        }}
        type={'Contact'}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
