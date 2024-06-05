import { render } from '../../helpers/render';
import ReceivingAccounts from './ReceivingAccounts';

describe('ReceivingAccounts', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ReceivingAccounts />);
    expect(baseElement).toBeTruthy();
  });
});
