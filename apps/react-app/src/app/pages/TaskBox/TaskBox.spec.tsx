import { waitFor } from '@admiin-com/ds-web-testing-utils';
import TaskBox from './TaskBox';
import { render } from '../../helpers/render';
// import { SidebarContainer } from '../../components/SidebarContainer/SidebarContainer';

describe('TaskBox', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      // <SidebarContainer>
      <TaskBox />
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
