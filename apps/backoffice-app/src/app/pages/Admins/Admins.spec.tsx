import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Admins from './Admins';

describe('AdminList', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <Admins />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
