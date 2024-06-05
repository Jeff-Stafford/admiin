import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Users from './Users';

describe('AdminList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Users />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
