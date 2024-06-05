import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UnAuthLayout } from './UnAuthLayout';

describe('UnAuthLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <UnAuthLayout />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
