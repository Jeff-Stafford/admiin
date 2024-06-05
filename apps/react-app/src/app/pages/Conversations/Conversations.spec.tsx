import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Conversations from './Conversations';

describe('Conversations', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <MockedProvider>
        <Conversations />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
