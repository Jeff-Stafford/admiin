import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import SignUp from './SignUp';

describe('SignUp', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SignUp />, { wrapper: BrowserRouter });
    expect(baseElement).toBeTruthy();
  });
});
