import { waitFor } from '@admiin-com/ds-web-testing-utils';
import Contacts from './Contacts';
import { render } from '../../helpers/render';
// import { SidebarContainer } from '../../components/SidebarContainer/SidebarContainer';

describe('Contacts', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      // <SidebarContainer>
      <Contacts />
      // </SidebarContainer>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
