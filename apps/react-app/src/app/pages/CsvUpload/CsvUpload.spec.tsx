import { waitFor } from '@admiin-com/ds-web-testing-utils';
import { CsvUpload } from './CsvUpload';
import { render } from '../../helpers/render';
// import { SidebarContainer } from '../../components/SidebarContainer/SidebarContainer';

describe('CsvUpload', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      // <SidebarContainer>
      <CsvUpload onUploaded={vi.fn()} />
      // </SidebarContainer>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
