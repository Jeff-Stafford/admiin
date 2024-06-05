import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TeamForm } from './TeamForm';
import {
  createTeam as CREATE_TEAM,
  updateTeam as UPDATE_TEAM,
} from '@admiin-com/ds-graphql';

const mocks = [
  {
    request: {
      query: gql(CREATE_TEAM),
      variables: {
        input: {
          title: 'Team Brilliant',
        },
      },
    },
    result: {
      data: {
        createTeam: {
          id: 'cb713823-ceac-4efd-b30e-a4b30b97935d',
          title: 'Team Brilliant',
          teamUsers: [],
          owner: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
          ownerUserId: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
          createdAt: '2023-03-18T10:51:26+0000',
          updatedAt: '2023-03-18T10:51:26+0000',
        },
      },
    },
  },
  {
    request: {
      query: gql(UPDATE_TEAM),
      variables: {
        id: 'cb713823-ceac-4efd-b30e-a4b30b97935d',
        name: 'Team Fantastic',
      },
    },
    result: {
      data: {
        updateTeamItem: {
          id: 'cb713823-ceac-4efd-b30e-a4b30b97935d',
          title: 'Team Fantastic',
          ownerUserId: 'fc996c28-bbf9-4654-9e9a-7ce69a959adf',
          createdAt: '2023-03-18T10:51:26+0000',
          updatedAt: '2023-03-18T10:51:26+0000',
        },
      },
    },
  },
];

const renderComponent = () => {
  render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <TeamForm />
    </MockedProvider>,
    { wrapper: BrowserRouter }
  );

  return {};
};

//TODO: toBeInTheDocument
//it("renders", async () => {
//  renderComponent();
//
//  const titleInput = screen.getByRole("textbox", {
//    name: /teamNameTitle/i,
//  });
//
//  const submitButton = screen.getByRole("button", {
//    name: /createTitle/i,
//  });
//
//  expect(titleInput).toBeInTheDocument();
//  expect(submitButton).toBeInTheDocument();
//});

it('Creates team on submit', async () => {
  renderComponent();

  // const titleInput = screen.getByRole('textbox', {
  //   name: /teamNameTitle/i,
  // });

  // const submitButton = screen.getByRole('button', {
  //   name: /createTitle/i,
  // });

  // await user.click(titleInput);
  // await user.type(titleInput, 'Team Brilliant');

  // await waitFor(async () => {
  //   // team title
  //   // submit
  //   await user.click(submitButton);
  // });

  // expect(onSubmitMock).toHaveBeenCalledTimes(0);
});
