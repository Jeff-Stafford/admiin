import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import OnboardingProfileImage from './OnboardingProfileImage';

describe('OnboardingProfileImage', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <OnboardingProfileImage />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
