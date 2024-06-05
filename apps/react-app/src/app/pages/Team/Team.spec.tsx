import { render } from '@testing-library/react';

import Team from './Team';

describe('Team', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Team />);
    expect(baseElement).toBeTruthy();
  });
});
