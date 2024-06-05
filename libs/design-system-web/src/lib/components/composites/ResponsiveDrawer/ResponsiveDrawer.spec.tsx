import { render } from '@testing-library/react';
import { Flex } from '../../primatives/Flex/Flex';

import { ResponsiveDrawer } from './ResponsiveDrawer';

describe('ResponsiveDrawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ResponsiveDrawer
        drawerWidth={250}
        logoFullSrc=""
        logoIconSrc=""
        paths={[
          {
            to: '/office',
            title: 'Office',
            icon: 'Briefcase',
          },
        ]}
      >
        <Flex />
      </ResponsiveDrawer>
    );
    expect(baseElement).toBeTruthy();
  });
});
