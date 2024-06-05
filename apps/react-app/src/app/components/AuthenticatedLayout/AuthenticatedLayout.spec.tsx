import { AuthenticatedLayout } from './AuthenticatedLayout';
import { waitFor } from '@admiin-com/ds-web-testing-utils';
import { render } from '../../helpers/render';
import { gql } from '@apollo/client';
import { getUser } from '@admiin-com/ds-graphql';
import { MockedResponse } from '@apollo/client/testing';
export const mocks: MockedResponse[] = [
  {
    request: {
      query: gql`
        ${getUser}
      `,
      variables: { id: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf' },
    },
    result: { data: { getUser: null } },
  },
];
describe('AdminLayout', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<AuthenticatedLayout />, { mocks });
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
