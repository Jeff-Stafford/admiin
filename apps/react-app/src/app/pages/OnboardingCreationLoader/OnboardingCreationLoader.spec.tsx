import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import OnboardingCreationLoader from './OnboardingCreationLoader';
import * as OnboardingContextModule from '../../components/OnboardingContainer/OnboadringContainer'; // Adjust the import path as necessary
import { OnboardingStatus } from '@admiin-com/ds-graphql';
import { OnboardingProcessContext } from '../../components/OnboardingContainer/OnboadringContainer';

describe('OnboardingCreationLoader', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(
      OnboardingContextModule,
      'useOnboardingProcess'
    ).mockImplementation(() => ({
      user: { firstName: '', lastName: '' }, // Add more properties as needed by the component
      currentOnboardingStatus: OnboardingStatus.COMPLETED,
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
        <OnboardingCreationLoader />
      </OnboardingProcessContext.Provider>
    );

    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
