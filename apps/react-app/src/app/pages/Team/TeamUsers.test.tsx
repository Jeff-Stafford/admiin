import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import {
  CSGetSub as GET_SUB,
  CSgetTeam as GET_TEAM,
} from '@admiin-com/ds-graphql';
import { TeamUsers } from './TeamUsers';

const mocks = [
  {
    request: {
      query: gql(GET_SUB),
    },
    result: {
      data: {
        sub: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
      },
    },
  },
  {
    request: {
      query: gql(GET_TEAM),
      variables: {
        id: 'cb713823-ceac-4efd-b30e-a4b30b97935d',
      },
    },
    result: {
      data: {
        getTeam: {
          id: 'cb713823-ceac-4efd-b30e-a4b30b97935d',
          title: 'Team Brilliant',
          teamUsers: {
            items: [
              {
                id: 'a950013a-9f36-4eff-a3d4-329834a023f1',
                teamId: 'cb713823-ceac-4efd-b30e-a4b30b97935d',
                userId: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
                owners: ['fc996c28-bbf9-4654-9e9a-7ce69a959adf'],
                createdAt: '2022-11-15T04:26:12.145Z',
                createdBy: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
                updatedAt: '2022-11-15T04:26:12.145Z',
                teamTeamUsersId:
                  'a950013a-9f36-4eff-a3d4-329834a023f1a950013a-9f36-4eff-a3d4-329834a023f1', //TODO: insert expected value
                user: {
                  id: 'ac3d46a3-a719-4958-85fd-b826cb6a6d61',
                  about: 'I am Brand Oz',
                  billingId: 'ee9fea6b-4e21-4630-8976-80d236af2b78',
                  blocked: [],
                  blockedBy: [],
                  country: 'AU',
                  createdAt: '2022-11-11T03:55:10.212Z',
                  email: 'alwtesting2020+brandoz1@gmail.com',
                  firstName: 'Brand',
                  identityId: null,
                  interests: [],
                  lastName: 'Oz',
                  locale: null,
                  onboardingStatus: 'COMPLETED',
                  owner:
                    'ac3d46a3-a719-4958-85fd-b826cb6a6d61::ac3d46a3-a719-4958-85fd-b826cb6a6d61',
                  phone: null,
                  profileImg: {
                    level: 'protected',
                    identityId:
                      'us-east-1:74aaa67e-3800-427e-b9dd-53e01b45ca1d',
                    key: 'c099482b-c0eb-4108-a226-e07e33bc0a2b.JPG',
                    alt: 'profile image',
                  },
                  teamId: 'cb713823-ceac-4efd-b30e-a4b30b97935d',
                  updatedAt: '2022-11-11T03:55:40.897Z',
                },
              },
            ],
            nextToken: null,
          },
          owner: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
          ownerUserId: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
          createdAt: '2023-03-18T10:51:26+0000',
          updatedAt: '2023-03-18T10:51:26+0000',
        },
      },
    },
  },
];

const renderComponent = async () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TeamUsers teamId="cb713823-ceac-4efd-b30e-a4b30b97935d" />
    </MockedProvider>,
    { wrapper: BrowserRouter }
  );
};

it('renders', async () => {
  await renderComponent();

  const teamUsersName = await screen.findAllByText('Brand Oz');
  expect(teamUsersName).toHaveLength(1);
});
