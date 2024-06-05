import { waitFor, cleanup } from '@testing-library/react';
import OnboardingBusinessCreate from './OnboardingBusinessCreate';
import * as OnboardingContextModule from '../../../components/OnboardingContainer/OnboadringContainer';
import { OnboardingStatus } from '@admiin-com/ds-graphql';
import { render } from '../../../helpers/render';
import { OnboardingProcessContext } from '../../../components/OnboardingContainer/OnboadringContainer';

describe('OnboardingBusinessCreate', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(
      OnboardingContextModule,
      'useOnboardingProcess'
    ).mockImplementation(() => ({
      user: { firstName: '', lastName: '' }, // Add more properties as needed by the component
      currentOnboardingStatus: OnboardingStatus.BUSINESS,
      updateUser: vi.fn(), // Mock any functions used by the component
      // ... add other properties and functions as necessary
      sub: '324-235',
      onboardingEntity: undefined,
      finishOnboarding: vi.fn(),
      setOnboardingEntity: vi.fn(),
      nextBusiness: vi.fn(),
    }));
  });

  afterEach(() => {
    cleanup(); // Cleanup the rendered components
    vi.restoreAllMocks(); // Restore all mocks to their original state
  });

  it('should render successfully', async () => {
    const { baseElement } = render(
      <OnboardingProcessContext.Provider value={null}>
        <OnboardingBusinessCreate />
      </OnboardingProcessContext.Provider>
    );

    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });

  // Add more tests as needed
});
