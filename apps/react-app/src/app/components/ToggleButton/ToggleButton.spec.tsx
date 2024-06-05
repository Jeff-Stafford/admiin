import { render } from '@testing-library/react';

import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ToggleButton
        onClick={vi.fn()}
        label="Onboarding Toggle Button"
        isSelected={false}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
