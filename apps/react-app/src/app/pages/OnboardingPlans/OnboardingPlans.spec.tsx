import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import OnboardingPlans from './OnboardingPlans';

describe('OnboardingPlans', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <OnboardingPlans />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
