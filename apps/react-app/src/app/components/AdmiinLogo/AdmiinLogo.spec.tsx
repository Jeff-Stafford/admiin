import { render } from '@testing-library/react';

import AdmiinLogo from './AdmiinLogo';

describe('AdmiinLogo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AdmiinLogo />);
    expect(baseElement).toBeTruthy();
  });
});
