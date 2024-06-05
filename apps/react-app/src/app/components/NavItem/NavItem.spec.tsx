import { render } from '../../helpers/render';
import { NavItem } from './NavItem';

describe('NavItem', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <NavItem title={''} icon={undefined} path={''} />
    );
    expect(baseElement).toBeTruthy();
  });
});
