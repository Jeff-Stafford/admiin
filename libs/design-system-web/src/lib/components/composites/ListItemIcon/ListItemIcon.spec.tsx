import { render } from '@testing-library/react';

import { ListItemIcon } from './ListItemIcon';

describe('ListItemIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListItemIcon />);
    expect(baseElement).toBeTruthy();
  });
});
