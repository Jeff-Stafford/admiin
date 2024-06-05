import { gql, useMutation } from '@apollo/client';
import { WBAlert, WBButton, WBForm, WBTextField } from '@admiin-com/ds-web';
import { isEmpty } from 'lodash';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from '../../components';
import {
  createTeam as CREATE_TEAM,
  updateTeam as UPDATE_TEAM,
} from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

export const TeamForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teamId } = useParams();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const [
    createTeam,
    {
      data: createData,
      loading: createLoading,
      error: createError,
      reset: resetCreate,
    },
  ] = useMutation(gql(CREATE_TEAM));

  const [
    updateTeam,
    {
      data: updateData,
      loading: updateLoading,
      error: updateError,
      reset: resetUpdate,
    },
  ] = useMutation(gql(UPDATE_TEAM));

  useEffect(() => {
    if (createData?.createTeam?.id) {
      navigate(`${PATHS.teamUpdate}/${createData.createTeam.id}`);
    }
  }, [createData, navigate]);

  const inputs = useMemo(
    () => ({
      title: {
        label: t('teamNameTitle', { ns: 'team' }),
        placeholder: t('teamNamePlaceholder', { ns: 'team' }),
        name: 'title',
        type: 'text',
        defaultValue: '',
        rules: {
          required: t('titleRequired', { ns: 'common' }),
        },
      },
    }),
    [t]
  );

  const onSubmit = async ({ title }: any) => {
    if (teamId) {
      try {
        await updateTeam({
          variables: {
            input: {
              id: teamId,
              title,
            },
          },
        });
      } catch (err) {
        console.log('ERROR update team: ', err);
      }
    } else {
      try {
        await createTeam({
          variables: {
            input: {
              title,
            },
          },
        });
      } catch (err) {
        console.log('ERROR create team: ', err);
      }
    }
  };

  return (
    <>
      <WBForm onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name={inputs.title.name}
          rules={inputs.title.rules}
          defaultValue={inputs.title.defaultValue}
          render={({ field }) => (
            <WBTextField
              {...field}
              type="text"
              label={inputs.title.label}
              error={!!(errors.title && errors.title.message)}
              helperText={
                ((errors.title && errors.title.message) as string) || ''
              }
              margin="dense"
            />
          )}
        />

        {(!isEmpty(createError) || !isEmpty(updateError)) && (
          <WBAlert
            title={createError?.message || updateError?.message}
            severity="error"
            sx={{ my: 2 }}
          />
        )}

        <WBButton
          //disabled={!isValid}
          loading={teamId ? updateLoading : createLoading}
          sx={{
            mt: 2,
            alignSelf: 'flex-start',
          }}
        >
          {teamId
            ? t('updateTitle', { ns: 'common' })
            : t('createTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>

      {!isEmpty(createData) && (
        <WBAlert
          title={t('teamCreatedSuccessfully', { ns: 'team' })}
          severity="success"
          onClose={resetCreate}
          sx={{ mt: 2 }}
        >
          <Link to={`${PATHS.team}/${teamId}`}>
            {t('addTeamMembers', { ns: 'team' })}
          </Link>
        </WBAlert>
      )}

      {!isEmpty(updateData) && (
        <WBAlert
          title={t('teamUpdatedSuccessfully', { ns: 'team' })}
          severity="success"
          onClose={resetUpdate}
          sx={{ mt: 2 }}
        />
      )}
    </>
  );
};
