import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import OnboardingInterests from './OnboardingInterests';

describe('OnboardingInterests', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<OnboardingInterests />);

    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
