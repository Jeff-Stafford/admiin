import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from './ResetPassword';

describe('ResetPassword', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ResetPassword />, {
      wrapper: BrowserRouter,
    });
    expect(baseElement).toBeTruthy();
  });
});
