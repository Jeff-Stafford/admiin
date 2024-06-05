import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Support from './Support';

describe('Support', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Support />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
