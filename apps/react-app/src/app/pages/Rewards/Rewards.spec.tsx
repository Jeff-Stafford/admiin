import { render } from '@testing-library/react';

import Rewards from './Rewards';

describe('Templates', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Rewards />);
    expect(baseElement).toBeTruthy();
  });
});
