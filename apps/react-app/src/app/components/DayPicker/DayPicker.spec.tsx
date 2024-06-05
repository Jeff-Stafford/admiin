import { render } from '@testing-library/react';

import DayPicker from './DayPicker';

describe('DayPicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DayPicker />);
    expect(baseElement).toBeTruthy();
  });
});
