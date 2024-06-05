import { render } from '../../helpers/render';
import NavDrawer from './NavDrawer';

describe('NavDrawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavDrawer logo={undefined} />);
    expect(baseElement).toBeTruthy();
  });
});
