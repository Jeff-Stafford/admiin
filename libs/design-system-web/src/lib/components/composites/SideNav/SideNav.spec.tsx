import { render } from '@testing-library/react';

import { SideNav } from './SideNav';

describe('SideNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SideNav paths={[{ to: '/about', title: 'About', icon: 'Briefcase' }]} />
    );
    expect(baseElement).toBeTruthy();
  });
});
