import { render } from '@testing-library/react';

import TaskBreakDownModal from './TaskBreakDownModal';

describe('TaskBreakDownModal', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TaskBreakDownModal />);
    expect(baseElement).toBeTruthy();
  });
});
