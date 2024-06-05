import { render } from '@testing-library/react';

import { ListItemAvatar } from './ListItemAvatar';

describe('ListItemAvatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListItemAvatar />);
    expect(baseElement).toBeTruthy();
  });
});
