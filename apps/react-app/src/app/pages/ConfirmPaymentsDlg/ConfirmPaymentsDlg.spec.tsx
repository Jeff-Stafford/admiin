import { render } from '../../helpers/render';
import ConfirmPaymentsDlg from './ConfirmPaymentsDlg';

describe('ConfirmPaymentsDlg', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ConfirmPaymentsDlg
        open={false}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
