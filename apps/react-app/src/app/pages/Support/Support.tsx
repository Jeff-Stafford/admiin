import {
  PRIVACY_POLICY_URL,
  TERMS_CONDITIONS_URL,
} from '@admiin-com/ds-common';
import {
  WBLink,
  WBList,
  WBListItem,
  WBListItemText,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../components';

const Support = () => {
  const { t } = useTranslation();
  return (
    <PageContainer sx={{ py: 0 }}>
      <WBTypography variant="h1">
        {t('supportTitle', { ns: 'common' })}
      </WBTypography>

      <WBList subheader="Legal">
        <WBListItem
          secondaryAction={
            <WBLink
              href={PRIVACY_POLICY_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('viewTitle', { ns: 'common' })}
            </WBLink>
          }
        >
          <WBListItemText>
            {t('privacyPolicyTitle', { ns: 'common' })}
          </WBListItemText>
        </WBListItem>
        <WBListItem
          secondaryAction={
            <WBLink
              href={TERMS_CONDITIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('viewTitle', { ns: 'common' })}
            </WBLink>
          }
        >
          <WBListItemText>
            {t('termsConditionsTitle', { ns: 'common' })}
          </WBListItemText>
        </WBListItem>
      </WBList>
      {/*<WBBox>*/}
      {/*  <WBLink href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">*/}
      {/*    {t('privacyPolicyTitle', { ns: 'common' })}*/}
      {/*  </WBLink>*/}
      {/*  <br/>*/}
      {/*  <WBLink href={TERMS_CONDITIONS_URL} target="_blank" rel="noopener noreferrer">*/}
      {/*    {t('termsConditionsTitle', { ns: 'common' })}*/}
      {/*  </WBLink>*/}
      {/*</WBBox>*/}
    </PageContainer>
  );
};

export default Support;
