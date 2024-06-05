import { render } from '@testing-library/react';

import NotificationsMenu from './NotificationsMenu';

describe('NotificationsMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NotificationsMenu />);
    expect(baseElement).toBeTruthy();
  });
});
