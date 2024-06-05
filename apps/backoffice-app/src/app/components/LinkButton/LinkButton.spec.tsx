import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LinkButton } from './LinkButton';

describe('LinkButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<LinkButton />, { wrapper: BrowserRouter });
    expect(baseElement).toBeTruthy();
  });
});
