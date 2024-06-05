import { render } from '@testing-library/react';

import VerificationComplete from './VerificationComplete';

describe('VerificationComplete', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<VerificationComplete onClose={vi.fn()} />);
    expect(baseElement).toBeTruthy();
  });
});
