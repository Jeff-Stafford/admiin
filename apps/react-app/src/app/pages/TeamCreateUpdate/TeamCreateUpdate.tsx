import { WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { PageContainer } from '../../components';
import { TeamForm } from '../Team/TeamForm';

const TeamCreateUpdate = () => {
  const { t } = useTranslation();
  const { teamId } = useParams();

  return (
    <PageContainer>
      <WBTypography variant="h1">
        {teamId
          ? t('updateTeamTitle', { ns: 'team' })
          : t('createTeamTitle', { ns: 'team' })}
      </WBTypography>
      <TeamForm />
    </PageContainer>
  );
};

export default TeamCreateUpdate;
