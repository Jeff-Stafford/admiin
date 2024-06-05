import { render } from '../../helpers/render';
import ClientDetail from './ClientDetail';

describe('ClientDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ClientDetail contact={null} />);
    expect(baseElement).toBeTruthy();
  });
});
