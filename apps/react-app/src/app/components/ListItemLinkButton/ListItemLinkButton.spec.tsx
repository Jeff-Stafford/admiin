import { ListItemLinkButton } from './ListItemLinkButton';
import { render } from '../../helpers/render';

describe('LinkButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListItemLinkButton />);
    expect(baseElement).toBeTruthy();
  });
});
