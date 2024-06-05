import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Account from './Account';

describe('Account', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Account />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
