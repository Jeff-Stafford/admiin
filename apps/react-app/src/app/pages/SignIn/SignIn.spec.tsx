import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import SignIn from './SignIn';

describe('SignIn', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <SignIn />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
