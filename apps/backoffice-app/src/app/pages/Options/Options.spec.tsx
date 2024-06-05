import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Options from './Options';
describe('Options', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Options />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
