import { render } from '@testing-library/react';

import { ToggleButtonGroup } from './ToggleButtonGroup';

describe('ToggleButtonGroup', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToggleButtonGroup />);
    expect(baseElement).toBeTruthy();
  });
});
