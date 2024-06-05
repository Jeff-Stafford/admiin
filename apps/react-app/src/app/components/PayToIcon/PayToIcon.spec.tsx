import { render } from '@testing-library/react';

import PayToIcon from './PayToIcon';

describe('PayToIcon', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PayToIcon />);
    expect(baseElement).toBeTruthy();
  });
});
