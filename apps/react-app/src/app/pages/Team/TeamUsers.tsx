import { gql, useMutation, useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { CSdeleteTeamUser as DELETE_TEAM_USER } from '@admiin-com/ds-graphql';
import { WBIconButton, WBList } from '@admiin-com/ds-web';
import { WBS3ListItem } from '@admiin-com/ds-amplify-web';
import { PROFILE_PLACEHOLDER } from '@admiin-com/ds-common';
import { useMemo } from 'react';
import { Team, TeamUser } from '@admiin-com/ds-graphql';
import {
  CSGetSub as GET_SUB,
  CSgetTeam as GET_TEAM,
} from '@admiin-com/ds-graphql';

type TeamUsersProps = {
  teamId: string;
};

export const TeamUsers = ({ teamId }: TeamUsersProps) => {
  const { t } = useTranslation();
  const { data: subData } = useQuery(gql(GET_SUB));
  const { data: teamData } = useQuery(gql(GET_TEAM), {
    variables: {
      id: teamId,
    },
    skip: !teamId,
  });

  const [deleteTeamUser] = useMutation(gql(DELETE_TEAM_USER));

  const team: Team = useMemo(() => teamData?.getTeam || {}, [teamData]);
  const teamUsers: TeamUser[] = useMemo(
    () => teamData?.getTeam?.teamUsers?.items || [],
    [teamData]
  );

  const getIcon = (teamUser: TeamUser) => {
    // logged in user is team leader and user is a team member
    if (subData?.sub && teamUser?.owners?.includes(subData.sub)) {
      if (teamUser?.userId !== subData.sub) {
        return 'Close';
      }
    }

    // logged in user is a team member
    if (subData?.sub && teamUser?.userId === subData.sub) {
      return 'Close';
    }

    // logged in user is team leader
    if (teamUser?.userId === team?.owner) {
      return 'Medal';
    }

    return '';
  };

  const onIconClick = async (teamUser: TeamUser) => {
    if (teamUser?.userId !== team?.owner) {
      const confirm = window.confirm(
        t('confirmDeleteTeamMemberMessage', { ns: 'team' })
      );

      if (confirm) {
        try {
          await deleteTeamUser({
            variables: {
              input: {
                id: teamUser.id,
              },
            },
          });
        } catch (err) {
          console.log('ERROR delete team user: ', err);
        }
      }
    }
  };

  return (
    <WBList>
      {teamUsers?.map(({ user, ...teamUser }) => (
        <WBS3ListItem
          key={teamUser?.id}
          imgKey={user?.profileImg?.key}
          identityId={user?.profileImg?.identityId}
          level={user?.profileImg?.level}
          src={PROFILE_PLACEHOLDER}
          primary={
            user?.firstName
              ? `${user?.firstName} ${user?.lastName}`
              : t('deletedUser', { ns: 'common' })
          }
          secondaryAction={
            <WBIconButton
              edge="end"
              disabled={getIcon(teamUser) === 'Close'}
              color={getIcon(teamUser) === 'Close' ? 'error' : undefined}
              icon={getIcon(teamUser)}
              onClick={() => onIconClick(teamUser)}
            />
          }
        />
      ))}
    </WBList>
  );
};
