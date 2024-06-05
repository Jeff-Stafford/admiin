import { waitFor } from '@admiin-com/ds-web-testing-utils';

import { render } from '../../helpers/render';
import XeroRedirect from './XeroRedirect';
import ApolloClientProvider from '../../components/ApolloClientProvider/ApolloClientProvider';

describe('XeroRedirect', async () => {
  it('should render successfully', async () => {
    const { baseElement } = render(
      <ApolloClientProvider>
        <XeroRedirect />
      </ApolloClientProvider>
    );
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
