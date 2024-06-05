import { gql, useMutation } from '@apollo/client';
import {
  xeroCreateConsentUrl as XERO_CREATE_CONSENT_URL,
  XeroScopeSet,
} from '@admiin-com/ds-graphql';
import { WBBox, WBButton, WBSvgIcon, WBTypography } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import XeroLogo from '../../../assets/icons/xero-logo.svg';

export const ConnectDisconnectXero = () => {
  const { t } = useTranslation();
  const [xeroCreateConsentUrl] = useMutation(gql(XERO_CREATE_CONSENT_URL), {
    //client: configureAppSyncClient({ authType: 'API_KEY' })
  });

  const onSignUpXero = async () => {
    try {
      const { data } = await xeroCreateConsentUrl({
        variables: {
          input: {
            scopeSet: XeroScopeSet.ACCOUNTING,
          },
        },
      });
      if (data?.xeroCreateConsentUrl) {
        window.location.replace(data?.xeroCreateConsentUrl);
      }
    } catch (err) {
      console.log('ERROR create xero token set', err);
    }
  };

  return (
    <WBButton
      fullWidth
      sx={{
        borderRadius: '999px',
        backgroundColor: '#13B5EA',
        '&:hover': {
          backgroundColor: '#088cb9',
        },
        color: 'white',
        padding: 3,
        display: 'flex',
        justifyContent: 'start',
      }}
      onClick={onSignUpXero}
    >
      <WBSvgIcon
        viewBox="0 0 6 6"
        fontSize="large"
        component={'div'}
        sx={{ backgroundColor: `rgba(255,255,255,0)` }}
      >
        <XeroLogo />
      </WBSvgIcon>
      <WBBox ml={2}>
        <WBTypography color={'inherit'} fontWeight={'medium'}>
          {t('syncWithXero', { ns: 'contacts' })}
        </WBTypography>
        <WBTypography variant="body2" color={'inherit'} fontWeight={'regular'}>
          {t('synchronizeXeroContacts', { ns: 'contacts' })}
        </WBTypography>
      </WBBox>
    </WBButton>
    //<WBButton
    //  onClick={onSignUpXero}
    //  sx={{
    //    backgroundColor: '#13B5EA',
    //    '&:hover': {
    //      backgroundColor: '#13B5EA',
    //      opacity: 0.5,
    //    },
    //  }}
    //>
    //  {t('connectXero', { ns: 'authentication' })}
    //</WBButton>
  );
};
