import { gql, useQuery } from '@apollo/client';
import { WBTypography } from '@admiin-com/ds-web';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../../components';
import { CSgetTeam as GET_TEAM } from '@admiin-com/ds-graphql';
import { TeamUserForm } from './TeamUserForm';

const TeamUserCreateUpdate = () => {
  const { t } = useTranslation();
  const { teamId } = useParams();
  const { data: teamData } = useQuery(gql(GET_TEAM), {
    variables: {
      id: teamId,
    },
    skip: !teamId,
  });

  const team = useMemo(() => teamData?.getTeam || {}, [teamData]);

  return (
    <PageContainer>
      <WBTypography variant="h1">{team?.title}</WBTypography>
      <WBTypography variant="h3">
        {t('addTeamMemberTitle', { ns: 'team' })}
      </WBTypography>
      <WBTypography>{t('teamMemberTempPassword', { ns: 'team' })}</WBTypography>
      <TeamUserForm />
    </PageContainer>
  );
};

export default TeamUserCreateUpdate;
