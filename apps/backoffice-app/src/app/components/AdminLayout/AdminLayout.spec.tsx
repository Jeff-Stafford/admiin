import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';

describe('AdminLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MockedProvider>
        <AdminLayout />
      </MockedProvider>,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
