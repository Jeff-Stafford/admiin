import { render } from '@testing-library/react';

import HubListener from './HubListener';

describe('HubListener', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HubListener />);
    expect(baseElement).toBeTruthy();
  });
});
