import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Plans from './Plans';

describe('Plans', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Plans />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
