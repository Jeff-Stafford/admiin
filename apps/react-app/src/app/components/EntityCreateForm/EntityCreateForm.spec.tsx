import { render } from '../../helpers/render';
import EntityCreateForm from './EntityCreateForm';

describe('EntityCreateForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<EntityCreateForm />);
    expect(baseElement).toBeTruthy();
  });
});
