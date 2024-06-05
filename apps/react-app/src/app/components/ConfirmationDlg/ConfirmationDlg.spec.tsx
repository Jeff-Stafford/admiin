import { render } from '@testing-library/react';

import ConfirmationDlg from './ConfirmationDlg';

describe('ConfirmationDlg', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ConfirmationDlg
        open={false}
        children={undefined}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
        onOK={function (): void {
          throw new Error('Function not implemented.');
        }}
        title={''}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
