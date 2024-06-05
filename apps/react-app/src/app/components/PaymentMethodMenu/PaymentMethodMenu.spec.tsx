import { render } from '../../helpers/render';
import { PaymentMethodMenu } from './PaymentMethodMenu';
import { AccountDirection } from '@admiin-com/ds-graphql';

describe('PaymentMethodMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PaymentMethodMenu
        accountDirection={AccountDirection.DISBURSEMENT}
        paymentMethod={null}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
