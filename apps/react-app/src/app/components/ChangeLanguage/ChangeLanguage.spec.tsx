import { waitFor } from '@testing-library/react';
import { render } from '../../helpers/render';
import { ChangeLanguage } from './ChangeLanguage';

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
describe('ChangeLanguage', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(<ChangeLanguage />, { mocks });
    await waitFor(() => {
      expect(baseElement).toBeTruthy();
    });
  });
});
