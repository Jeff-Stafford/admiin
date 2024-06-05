import { render } from '@testing-library/react';

import SmartUI from './SmartUI';

describe('SmartUI', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SmartUI />);
    expect(baseElement).toBeTruthy();
  });
});
