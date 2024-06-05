import { render } from '@testing-library/react';
import { BreakDownContainer } from './BreakDownContainer';

describe('BreakDownContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BreakDownContainer />);
    expect(baseElement).toBeTruthy();
  });
});
