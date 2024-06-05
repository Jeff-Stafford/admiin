import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Notifications from './Notifications';

describe('Notifications', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Notifications />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
