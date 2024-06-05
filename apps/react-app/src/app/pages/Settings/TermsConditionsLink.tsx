import {
  PRIVACY_POLICY_URL,
  SUPPORT_URL,
  TERMS_CONDITIONS_URL,
} from '@admiin-com/ds-common';
import { useApolloClient } from '@apollo/client';
import { isLoggedInVar } from '@admiin-com/ds-graphql';
import { Auth, Cache } from 'aws-amplify';
import { useCallback } from 'react';
import { WBBox, WBDivider, WBFlex, WBLink } from '@admiin-com/ds-web';
import { PATHS } from '../../navigation/paths';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

export const TermsConditionsLink = () => {
  const client = useApolloClient();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onLogOut = useCallback(async () => {
    client.cache.evict({ fieldName: 'me' });
    client.cache.gc();
    client.clearStore();
    try {
      //localStorage.removeItem('sub');
      localStorage.clear(); //TODO: ensure doesnt break anything clearing all of local storage
      await Cache.clear();
      await Auth.signOut();
      isLoggedInVar(false);
    } catch (err) {
      console.log('ERROR log out: ', err);
    }
  }, [client]);
  return (
    <WBFlex>
      <WBLink
        href={TERMS_CONDITIONS_URL}
        noWrap
        target="_blank"
        underline="always"
        variant="body2"
        sx={{ color: 'inherit', fontWeight: 'inherit' }}
        color="text.primary"
        m={1}
      >
        {t('termsConditionsTitle', { ns: 'common' })}
      </WBLink>
      <WBDivider
        sx={{
          bgcolor: 'common.black',
          my: 1.3,
        }}
        orientation="vertical"
        variant="middle"
        flexItem
      />
      <WBLink
        href={PRIVACY_POLICY_URL}
        target="_blank"
        noWrap
        underline="always"
        m={1}
        variant="body2"
        sx={{ color: 'inherit', fontWeight: 'inherit' }}
        color="text.primary"
      >
        {t('privacyPolicyTitle', { ns: 'common' })}
      </WBLink>

      {pathname === PATHS.account || pathname === PATHS.settings ? (
        <>
          <WBBox flexGrow={1} />
          <WBLink
            onClick={onLogOut}
            underline="always"
            noWrap
            m={1}
            variant="body2"
            sx={{ color: 'inherit', fontWeight: 'inherit' }}
            color="text.primary"
            href={PATHS.signIn}
          >
            {t('logOut', { ns: 'common' })}
          </WBLink>
        </>
      ) : (
        <>
          <WBDivider
            sx={{
              bgcolor: 'common.black',
              my: 1.3,
            }}
            orientation="vertical"
            variant="middle"
            flexItem
          />
          <WBLink
            href={SUPPORT_URL}
            target="_blank"
            textAlign={'center'}
            m={1}
            variant="body2"
            sx={{ color: 'inherit', fontWeight: 'inherit' }}
            color="text.primary"
          >
            {t('supportTitle', { ns: 'common' })}
          </WBLink>
        </>
      )}
    </WBFlex>
  );
};
