import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Security from './Security';

describe('Security', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Security />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
