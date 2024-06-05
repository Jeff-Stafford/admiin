import { render } from '../../helpers/render';
import CreditCardItem from './CreditCardItem';

describe('CreditCardItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CreditCardItem cc={null} />);
    expect(baseElement).toBeTruthy();
  });
});
