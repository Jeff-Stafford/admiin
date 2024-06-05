import { render } from '../../helpers/render';
import DirectDebitForm from './DirectDebitForm';

describe('DirectDebitForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<DirectDebitForm />);
    expect(baseElement).toBeTruthy();
  });
});
