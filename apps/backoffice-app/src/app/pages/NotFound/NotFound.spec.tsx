import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from './NotFound';
describe('NotFound', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <NotFound />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
