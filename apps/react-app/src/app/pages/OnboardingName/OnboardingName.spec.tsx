import { render } from '../../helpers/render';
import OnboardingName from './OnboardingName';
import * as OnboardingContextModule from '../../components/OnboardingContainer/OnboadringContainer'; // Adjust the import path as necessary
import { OnboardingStatus } from '@admiin-com/ds-graphql';
import { waitFor } from '@testing-library/react';
import { OnboardingProcessContext } from '../../components/OnboardingContainer/OnboadringContainer';

describe('OnboardingName', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(
      OnboardingContextModule,
      'useOnboardingProcess'
    ).mockImplementation(() => ({
      user: { firstName: '', lastName: '' }, // Add more properties as needed by the component
      currentOnboardingStatus: OnboardingStatus.PROFILE,
      updateUser: vi.fn(), // Mock any functions used by the component
      // ... add other properties and functions as necessary
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render successfully', async () => {
    const { baseElement } = render(
      <OnboardingProcessContext.Provider value={null}>
        <OnboardingName />
      </OnboardingProcessContext.Provider>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
