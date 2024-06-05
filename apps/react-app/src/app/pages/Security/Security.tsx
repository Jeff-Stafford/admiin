import {
  WBList,
  WBListItem,
  WBListItemButton,
  WBListItemText,
  WBModal,
  WBTypography,
} from '@admiin-com/ds-web';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import MfaForm from '../../components/MfaForm/MfaForm';

const Security = () => {
  const { t } = useTranslation();
  const [showChangePass, setShowChangePass] = useState(false);
  const [showMfa, setShowMfa] = useState(false);

  return (
    <>
      <WBModal
        title={t('changePasswordTitle', { ns: 'common' })}
        open={showChangePass}
        onClose={() => setShowChangePass(false)}
      >
        <ChangePasswordForm />
      </WBModal>

      <WBModal
        title={t('2faTitle', { ns: 'authentication' })}
        open={showMfa}
        sx={{
          minWidth: '60%',
          minHeight: '60%',
        }}
        onClose={() => setShowMfa(false)}
      >
        <MfaForm />
      </WBModal>

      <PageContainer sx={{ py: 0 }}>
        <WBTypography variant="h1">
          {t('securityTitle', { ns: 'common' })}
        </WBTypography>

        <WBList subheader="Sign in">
          <WBListItem
            secondaryAction={
              <WBListItemButton onClick={() => setShowChangePass(true)}>
                {t('editTitle', { ns: 'common' })}
              </WBListItemButton>
            }
          >
            <WBListItemText>
              {t('passwordTitle', { ns: 'common' })}
            </WBListItemText>
            <WBListItemText>******</WBListItemText>
          </WBListItem>
          <WBListItem
            secondaryAction={
              <WBListItemButton onClick={() => setShowMfa(true)}>
                {t('editTitle', { ns: 'common' })}
              </WBListItemButton>
            }
          >
            <WBListItemText>
              {t('2faTitle', { ns: 'authentication' })}
            </WBListItemText>
          </WBListItem>
        </WBList>
      </PageContainer>
    </>
  );
};

export default Security;
