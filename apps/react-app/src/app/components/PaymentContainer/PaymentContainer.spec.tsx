import { render } from '../../helpers/render';
import PaymentContainer from './PaymentContainer';

describe('PaymentContainer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PaymentContainer>
        <div></div>
      </PaymentContainer>
    );
    expect(baseElement).toBeTruthy();
  });
});
