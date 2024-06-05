import { render } from '@testing-library/react';

import SimpleDrawDlg from './SimpleDrawDlg';

describe('SimpleDrawDlg', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SimpleDrawDlg />);
    expect(baseElement).toBeTruthy();
  });
});
