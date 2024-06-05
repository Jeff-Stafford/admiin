import { gql, useQuery } from '@apollo/client';
import { WBAlert, WBFlex, WBSkeleton, WBTypography } from '@admiin-com/ds-web';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationConnection } from '@admiin-com/ds-graphql';
import { Link, PageContainer } from '../../components';
import { listTranslations as LIST_TRANSLATIONS } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

const Translations = () => {
  const { t } = useTranslation();
  const {
    data: translationsData,
    error: translationsError,
    loading: translationsLoading,
  } = useQuery(gql(LIST_TRANSLATIONS));

  const translations = useMemo(
    () => translationsData?.listTranslations || [],
    [translationsData]
  );

  return (
    <PageContainer>
      <WBAlert
        title={t('translationsUpdateInfo', { ns: 'backoffice' })}
        severity="warning"
      />
      {translations?.map((translation: TranslationConnection) => (
        <WBFlex key={translation.language} flexDirection="column" mt={3}>
          <WBTypography variant="h3">{translation.language}</WBTypography>

          {translation?.items?.map((namespace: any) => (
            <WBFlex
              key={`${translation.language}-${namespace?.namespace}`}
              mt={1}
            >
              <Link
                to={`${PATHS.translations}/${translation.language}?namespace=${namespace?.namespace}`}
              >
                {namespace?.namespace}
              </Link>
            </WBFlex>
          ))}

          {translationsLoading && (
            <>
              <WBSkeleton width={40} />
              <WBSkeleton width={200} sx={{ mt: 2 }} />
              <WBSkeleton width={200} />
              <WBSkeleton width={200} />
            </>
          )}
        </WBFlex>
      ))}

      {translationsError?.message && (
        <WBAlert
          title={translationsError?.message}
          severity="error"
          sx={{ my: 2 }}
        />
      )}
    </PageContainer>
  );
};

export default Translations;
