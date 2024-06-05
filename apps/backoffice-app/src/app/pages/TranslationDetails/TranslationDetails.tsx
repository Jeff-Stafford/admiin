import { gql, useMutation, useQuery } from '@apollo/client';
import {
  WBAlert,
  WBButton,
  WBFlex,
  WBForm,
  WBTextField,
  WBTypography,
} from '@admiin-com/ds-web';
import { isEmpty } from 'lodash';
import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { PageContainer } from '../../components';
import { updateTranslation as UPDATE_TRANSLATION } from '@admiin-com/ds-graphql';
import { getTranslation as GET_TRANSLATION } from '@admiin-com/ds-graphql';

const TranslationDetails = () => {
  const { t } = useTranslation();
  const { translationId } = useParams();
  const [searchParams] = useSearchParams();
  const namespace = searchParams.get('namespace');
  const { control, handleSubmit } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const { data: translationData } = useQuery(gql(GET_TRANSLATION), {
    variables: {
      language: translationId,
      namespace,
    },
    skip: !translationId || !namespace,
  });

  const [
    updateTranslation,
    {
      loading: updateLoading,
      data: updateData,
      error: updateError,
      reset: resetUpdate,
    },
  ] = useMutation(gql(UPDATE_TRANSLATION));

  const translation = useMemo(
    () =>
      translationData?.getTranslation?.data
        ? {
            ...translationData?.getTranslation,
            data: JSON.parse(translationData?.getTranslation?.data),
          }
        : {},
    [translationData]
  );

  const inputs = useMemo(
    () =>
      translation?.data
        ? Object.keys(translation?.data).map((name: string) => ({
            name,
            value: translation.data[name],
            label: name,
          }))
        : [],
    [translation]
  );

  const onSubmit = async (data: any) => {
    try {
      await updateTranslation({
        variables: {
          input: {
            language: translationId,
            namespace,
            data: JSON.stringify(data),
          },
        },
      });
    } catch (err) {
      console.log('ERROR update translation: ', err);
    }
  };

  return (
    <PageContainer>
      <WBTypography variant="h1">{translation.language}</WBTypography>
      <WBForm onSubmit={handleSubmit(onSubmit)}>
        {inputs?.map((input: any) => (
          <Controller
            key={input.name}
            control={control}
            name={input.name}
            defaultValue={input.value}
            render={({ field }) => (
              <WBTextField {...field} label={input.label} margin="dense" />
            )}
          />
        ))}

        {!isEmpty(updateData) && (
          <WBAlert
            title={t('translationUpdatedSuccess', { ns: 'translations' })}
            severity="success"
            onClose={resetUpdate}
            sx={{ mt: 2 }}
          />
        )}

        {updateError?.message && (
          <WBAlert
            title={updateError.message}
            severity="error"
            sx={{ my: 2 }}
          />
        )}

        <WBFlex>
          <WBButton sx={{ mt: 1 }} loading={updateLoading}>
            {t('updateTitle', { ns: 'common' })}
          </WBButton>
        </WBFlex>
      </WBForm>
    </PageContainer>
  );
};

export default TranslationDetails;
