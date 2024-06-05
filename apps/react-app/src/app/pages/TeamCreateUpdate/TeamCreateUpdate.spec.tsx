import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import TeamCreateUpdate from './TeamCreateUpdate';

describe('TeamCreateUpdate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <TeamCreateUpdate />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
