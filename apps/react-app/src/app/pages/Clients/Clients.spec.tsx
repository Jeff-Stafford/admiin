import { waitFor } from '@admiin-com/ds-web-testing-utils';
import Clients from './Clients';
import { render } from '../../helpers/render';
// import { SidebarContainer } from '../../components/SidebarContainer/SidebarContainer';

describe('Clients', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      // <SidebarContainer>
      <Clients />
      // </SidebarContainer>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
