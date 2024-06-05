import { waitFor } from '@admiin-com/ds-web-testing-utils';
import ApolloClientProvider from '../../components/ApolloClientProvider/ApolloClientProvider';
import Dashboard from './Dashboard';
import { render } from '../../helpers/render';
// import { SidebarContainer } from '../../components/SidebarContainer/SidebarContainer';

describe('Dashboard', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      // <SidebarContainer>
      <ApolloClientProvider>
        <Dashboard />
      </ApolloClientProvider>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
