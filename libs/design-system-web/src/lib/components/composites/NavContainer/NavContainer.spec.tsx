import { render } from '@testing-library/react';

import { NavContainer } from './NavContainer';

describe('NavContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavContainer />);
    expect(baseElement).toBeTruthy();
  });
});
