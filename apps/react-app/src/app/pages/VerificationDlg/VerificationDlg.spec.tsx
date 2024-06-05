import { render } from '../../helpers/render';
import VerificationDlg from './VerificationDlg';

describe('VerificationDlg', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <VerificationDlg onSuccess={vi.fn()} open={false} onClose={vi.fn()} />
    );
    expect(baseElement).toBeTruthy();
  });
});
