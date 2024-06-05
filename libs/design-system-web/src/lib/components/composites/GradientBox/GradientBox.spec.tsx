import { render } from '@testing-library/react';

import { GradientBox } from './GradientBox';

describe('GradientBox', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<GradientBox />);
    expect(baseElement).toBeTruthy();
  });
});
