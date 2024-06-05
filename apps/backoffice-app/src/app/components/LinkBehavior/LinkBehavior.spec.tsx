import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import { LinkBehavior } from './LinkBehavior';

describe('LinkBehavior', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <LinkBehavior href="https://google.com.au" to="/" />,
      { wrapper: BrowserRouter }
    );
    expect(baseElement).toBeTruthy();
  });
});
