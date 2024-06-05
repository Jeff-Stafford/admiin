import { render } from '@testing-library/react';

import SmartUIDlg from './SmartUIDlg';

describe('SmartUIDlg', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SmartUIDlg />);
    expect(baseElement).toBeTruthy();
  });
});
