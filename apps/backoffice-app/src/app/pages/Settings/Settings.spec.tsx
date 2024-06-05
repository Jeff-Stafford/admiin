import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Settings from './Settings';

describe('Settings', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Settings />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
