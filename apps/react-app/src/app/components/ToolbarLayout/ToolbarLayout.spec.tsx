import { render } from '@testing-library/react';

import ToolbarLayout from './ToolbarLayout';

describe('ToolbarLayout', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ToolbarLayout />);
    expect(baseElement).toBeTruthy();
  });
});
