import { render } from '@testing-library/react';

import ActionDisplay from './ActionDisplay';

describe('ActionDisplay', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ActionDisplay />);
    expect(baseElement).toBeTruthy();
  });
});
