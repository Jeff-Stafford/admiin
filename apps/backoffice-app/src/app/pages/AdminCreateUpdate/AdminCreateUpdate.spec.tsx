import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminCreateUpdate from './AdminCreateUpdate';

describe('AdminCreateUpdate', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <AdminCreateUpdate />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
