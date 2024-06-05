import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Link } from './Link';

describe('Link', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Link to="/">Link</Link>, {
      wrapper: BrowserRouter,
    });
    expect(baseElement).toBeTruthy();
  });
});
