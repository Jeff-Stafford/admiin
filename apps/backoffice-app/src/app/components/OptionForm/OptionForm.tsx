import { LANGUAGES } from '@admiin-com/ds-common';
import React, { useMemo, useRef } from 'react';
import { gql, useMutation } from '@apollo/client';
import { DynamicInputType, WBAlert, WBDynamicForm } from '@admiin-com/ds-web';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { CSoptionFragment } from '@admiin-com/ds-graphql';
import {
  createOption as CREATE_OPTION,
  createTranslation as CREATE_TRANSLATION,
} from '@admiin-com/ds-graphql';

interface OptionFormProps {
  name: string;
}

export const OptionForm = ({ name }: OptionFormProps) => {
  const { t } = useTranslation();
  const { group } = useParams();
  const formRef = useRef<HTMLFormElement>();

  const [
    createOption,
    {
      loading: createOptionLoading,
      data: createOptionData,
      error: createOptionError,
      reset: resetOptionCreate,
    },
  ] = useMutation(gql(CREATE_OPTION), {
    update(cache, { data }) {
      cache.modify({
        fields: {
          optionsByGroup(existing = []) {
            const dataRef = cache.writeFragment({
              data: data.createOption,
              fragment: gql(CSoptionFragment),
            });
            return { items: [existing.items.concat(dataRef)] };
          },
        },
      });
    },
  });

  const [createTranslation, { loading: createTranslationLoading }] =
    useMutation(gql(CREATE_TRANSLATION));

  //const input = {
  //  name: "option",
  //  label: t("newOptionTitle", { ns: "backoffice" }),
  //  placeholder: "",
  //  defaultValue: "",
  //  rules: {
  //    required: t("optionLabelRequired", { ns: "backoffice" }),
  //  },
  //};

  const inputs = useMemo(
    () => [
      {
        type: DynamicInputType.text,
        name: 'en',
        label: t('enOption', { ns: 'backoffice' }),
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('optionLabelRequired', { ns: 'backoffice' }),
        },
      },
      {
        type: DynamicInputType.text,
        name: 'de',
        label: t('deOption', { ns: 'backoffice' }),
        placeholder: '',
        defaultValue: '',
        //rules: {
        //  required: t("optionLabelRequired", { ns: "backoffice" }),
        //},
      },
    ],
    [t]
  );

  const onSubmit = async (data: any) => {
    try {
      await createOption({
        variables: {
          input: {
            name,
            group: group || t('categoriesTitle', { ns: 'backoffice' }),
            label: data.en,
            value: data.en,
          },
        },
      });

      for (let i = 0; i < LANGUAGES.length; i++) {
        if (data[LANGUAGES[i].value]) {
          await createTranslation({
            variables: {
              input: {
                language: LANGUAGES[i].value,
                namespace: 'options',
                name: data.en,
                value: data[LANGUAGES[i].value],
              },
            },
          });
        }
      }

      formRef?.current?.resetForm();
    } catch (err) {
      console.log('ERROR creating options: ', err);
    }
  };

  return (
    <>
      <WBDynamicForm
        ref={formRef}
        inputs={inputs}
        btnTitle={t('submitTitle', { ns: 'common' })}
        loading={createOptionLoading || createTranslationLoading}
        onSubmit={onSubmit}
      />

      {createOptionError?.message && (
        <WBAlert
          title={createOptionError?.message}
          severity="error"
          sx={{ my: 2 }}
        />
      )}

      {!isEmpty(createOptionData) && !createTranslationLoading && (
        <WBAlert
          title={t('createdSuccessfully', { ns: 'common' })}
          severity="success"
          onClose={resetOptionCreate}
          sx={{ mt: 2 }}
        />
      )}
    </>
  );
};
