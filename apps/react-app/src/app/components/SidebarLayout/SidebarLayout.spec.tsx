import { waitFor } from '@admiin-com/ds-web-testing-utils';
import { render } from '../../helpers/render';
import { useUserEntities } from '../../hooks/useUserEntities/useUserEntities';
import { Mock } from 'vitest';
import { SidebarLayout } from './SidebarLayout';

describe('SideBar', () => {
  beforeEach(() => {
    vi.mock('../../hooks/useUserEntities/useUserEntities', () => ({
      useUserEntities: vi.fn(),
    }));
  });
  it('should render successfully', async () => {
    (useUserEntities as Mock).mockReturnValue({
      entities: [{ id: 1, name: 'Entity 1' }],
    });
    const { baseElement } = render(
      <SidebarLayout
        drawerWidth={0}
        children={undefined}
        logoFullSrc={''}
        logoIconSrc={''}
      ></SidebarLayout>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
