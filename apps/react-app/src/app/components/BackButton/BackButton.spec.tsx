import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { BackButton } from './BackButton';
import * as OnboardingContextModule from '../../components/OnboardingContainer/OnboadringContainer'; // Adjust the import path as necessary
import { OnboardingStatus } from '@admiin-com/ds-graphql';

vi.mock('../../context', () => ({
  useOnboardingProcess: vi.fn(),
}));
describe('BackButton', () => {
  const setup = (onboardingStatus: OnboardingStatus) => {
    vi.spyOn(
      OnboardingContextModule,
      'useOnboardingProcess'
    ).mockImplementation(() => ({
      gotoPrev: vi.fn(),
      currentOnboardingStatus: onboardingStatus,
    }));

    return render(
      <BackButton
        onClick={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
  };
  it('should render successfully', async () => {
    const { baseElement } = setup(OnboardingStatus.COMPLETED);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
afterEach(() => {
  vi.resetAllMocks();
});
