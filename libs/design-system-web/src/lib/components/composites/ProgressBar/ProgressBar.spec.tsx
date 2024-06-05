import { render } from '@testing-library/react';

import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ProgressBar progress={10} />);
    expect(baseElement).toBeTruthy();
  });
});
