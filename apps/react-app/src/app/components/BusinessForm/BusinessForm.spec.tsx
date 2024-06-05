import { render } from '../../helpers/render';
import BusinessForm from './BusinessForm';

describe('BusinessForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BusinessForm />);
    expect(baseElement).toBeTruthy();
  });
});
