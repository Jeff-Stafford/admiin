import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import OnboardingBusiness from './OnboardingBusiness';

import * as OnboardingContextModule from '../../components/OnboardingContainer/OnboadringContainer'; // Adjust the import path as necessary
import { OnboardingStatus } from '@admiin-com/ds-graphql';
import {
  OnboardingBusinessStep,
  OnboardingProcessContext,
} from '../../components/OnboardingContainer/OnboadringContainer';
describe('OnboardingBusiness', () => {
  beforeEach(() => {
    // Mock the useOnboardingProcess hook with all necessary properties
    vi.spyOn(
      OnboardingContextModule,
      'useOnboardingProcess'
    ).mockImplementation(() => ({
      user: { firstName: '', lastName: '' }, // Add more properties as needed by the component
      currentOnboardingStatus: vi.fn(() => OnboardingStatus.PROFILE),
      currentBusinessStep: vi.fn(() => OnboardingBusinessStep.ADD_BUSINESS),
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
        <OnboardingBusiness />
      </OnboardingProcessContext.Provider>
    );

    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
