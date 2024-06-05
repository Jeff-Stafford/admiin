import { render } from '../../helpers/render';
import ContactDetail from './ContactDetail';

describe('ContactDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ContactDetail contact={null} />);
    expect(baseElement).toBeTruthy();
  });
});
