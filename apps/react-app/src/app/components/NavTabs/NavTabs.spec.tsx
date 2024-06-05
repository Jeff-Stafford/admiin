import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavTab from './NavTab';

describe('NavTabs', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavTab to={'/'} />, {
      wrapper: BrowserRouter,
    });
    expect(baseElement).toBeTruthy();
  });
});
