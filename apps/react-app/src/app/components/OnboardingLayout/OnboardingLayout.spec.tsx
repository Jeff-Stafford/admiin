import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { OnboardingLayout } from './OnboardingLayout';

describe('OnboardingLayout', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<OnboardingLayout />);
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
