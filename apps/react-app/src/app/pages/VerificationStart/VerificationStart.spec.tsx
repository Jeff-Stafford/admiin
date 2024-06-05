import { render } from '@testing-library/react';

import VerificationStart from './VerificationStart';

describe('VerificationStart', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VerificationStart />);
    expect(baseElement).toBeTruthy();
  });
});
