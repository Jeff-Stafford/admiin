import { render } from '@testing-library/react';

import { SideMenu } from './SideMenu';

describe('SideMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <SideMenu
        navigation1={[
          {
            label: 'Home',
            href: '/home',
            icon: 'Briefcase',
          },
        ]}
        navigation2={[
          {
            label: 'Sign in',
            href: '/sign-n',
            icon: 'Briefcase',
          },
        ]}
      />
    );
    expect(baseElement).toBeTruthy();
  });
});
