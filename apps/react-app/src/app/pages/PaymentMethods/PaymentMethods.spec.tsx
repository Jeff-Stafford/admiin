import { PaymentMethods } from './PaymentMethods';
import { render } from '../../helpers/render';

describe('PaymentMethods', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PaymentMethods />);
    expect(baseElement).toBeTruthy();
  });
});
