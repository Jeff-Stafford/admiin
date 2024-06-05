import { render } from '@testing-library/react';

import PayIDStatus from './PayIDStatus';

describe('PayIDStatus', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PayIDStatus />);
    expect(baseElement).toBeTruthy();
  });
});
