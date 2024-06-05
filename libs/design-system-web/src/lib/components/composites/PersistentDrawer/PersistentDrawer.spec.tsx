import { render } from '@testing-library/react';
import { Flex } from '../../primatives/Flex/Flex';

import { PersistentDrawer } from './PersistentDrawer';

describe('ResponsiveDrawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <PersistentDrawer
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
      </PersistentDrawer>
    );
    expect(baseElement).toBeTruthy();
  });
});
