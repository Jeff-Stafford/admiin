import { gql, useMutation } from '@apollo/client';
import { WBAlert, WBButton, WBTextField } from '@admiin-com/ds-web';
import { WBForm } from '@admiin-com/ds-web';
import { REGEX } from '@admiin-com/ds-common';
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Link } from '../../components';
import { CSTeamFragment as TEAM_FRAGMENT } from '@admiin-com/ds-graphql';
import { CScreateTeamUserItem as CREATE_TEAM_USER } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

interface TeamUserFormData {
  firstName: string;
  lastName: string;
  email: string;
}

export const TeamUserForm = () => {
  const { t } = useTranslation();
  const { teamId } = useParams();
  const [
    createTeamUser,
    {
      data: createData,
      error: createError,
      loading: createLoading,
      reset: resetCreate,
    },
  ] = useMutation(gql(CREATE_TEAM_USER), {
    update(cache, { data: { createTeamUser } }) {
      cache.modify({
        fields: {
          listTeamUsers(existing = []) {
            const newRef = cache.writeFragment({
              data: createTeamUser,
              fragment: gql(TEAM_FRAGMENT),
            });

            return { items: existing.items.concat(newRef) };
          },
        },
      });
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TeamUserFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const inputs = useMemo(
    () => ({
      firstName: {
        label: t('firstNameTitle', { ns: 'common' }),
        name: 'firstName' as const,
        type: 'text',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('firstNameRequired', { ns: 'common' }),
        },
      },
      lastName: {
        label: t('lastNameTitle', { ns: 'common' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('lastNameRequired', { ns: 'common' }),
        },
      },
      email: {
        label: t('emailTitle', { ns: 'common' }),
        name: 'email' as const,
        type: 'email',
        placeholder: '',
        defaultValue: '',
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
    }),
    [t]
  );

  useEffect(() => {
    reset();
  }, [createData, reset]);

  const onSubmit = async (data: TeamUserFormData) => {
    try {
      await createTeamUser({
        variables: {
          input: {
            teamId,
            ...data,
          },
        },
      });
    } catch (err) {
      console.log('ERROR create team user: ', err);
    }
  };

  return (
    <>
      <WBForm onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name={inputs.firstName.name}
          rules={inputs.firstName.rules}
          defaultValue={inputs.firstName.defaultValue}
          render={({ field }) => (
            <WBTextField
              {...field}
              type={inputs.email.type}
              label={inputs.firstName.label}
              //placeholder={inputs.firstName.placeholder}
              error={!!(errors.firstName && errors.firstName.message)}
              helperText={
                ((errors.firstName && errors.firstName.message) as string) || ''
              }
              margin="dense"
            />
          )}
        />
        <Controller
          control={control}
          name={inputs.lastName.name}
          rules={inputs.lastName.rules}
          defaultValue={inputs.lastName.defaultValue}
          render={({ field }) => (
            <WBTextField
              {...field}
              type={inputs.email.type}
              label={inputs.lastName.label}
              //placeholder={inputs.lastName.placeholder}
              error={!!(errors.lastName && errors.lastName.message)}
              helperText={
                ((errors.lastName && errors.lastName.message) as string) || ''
              }
              margin="dense"
            />
          )}
        />
        <Controller
          control={control}
          name={inputs.email.name}
          rules={inputs.email.rules}
          defaultValue={inputs.email.defaultValue}
          render={({ field }) => (
            <WBTextField
              {...field}
              type={inputs.email.type}
              label={inputs.email.label}
              //placeholder={inputs.email.placeholder}
              error={!!(errors.email && errors.email.message)}
              helperText={
                ((errors.email && errors.email.message) as string) || ''
              }
              margin="dense"
            />
          )}
        />

        {createError?.message && (
          <WBAlert
            title={createError.message}
            severity="error"
            sx={{ my: 2 }}
          />
        )}

        <WBButton
          //disabled={!isValid}
          loading={createLoading}
          onClick={handleSubmit(onSubmit)}
          sx={{
            mt: 2,
            alignSelf: 'flex-start',
          }}
        >
          {t('addTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>

      {!isEmpty(createData) && (
        <WBAlert
          title={t('teamMemberAdded', { ns: 'team' })}
          severity="success"
          onClose={resetCreate}
          sx={{ mt: 2 }}
        >
          <Link to={`${PATHS.team}/${teamId}`}>
            {t('viewTeamTitle', { ns: 'team' })}
          </Link>
        </WBAlert>
      )}
    </>
  );
};
