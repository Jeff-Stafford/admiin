import { render } from '@testing-library/react';

import { Menu } from './Menu';

describe('Menu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Menu open />);
    expect(baseElement).toBeTruthy();
  });
});
