import {
  WBAlert,
  WBBox,
  WBButton,
  WBFlex,
  WBForm,
  WBTextField,
} from '@admiin-com/ds-web';
import { getNextOnboardingStep } from '@admiin-com/ds-common';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { getOnboardingPath } from '../../helpers/onboarding';
import {
  //createEntity as CREATE_ENTITY,
  //Entity,
  EntityType,
  EntityUser,
  entityUsersByUser as LIST_ENTITY_USERS,
  updateEntity as UPDATE_ENTITY,
} from '@admiin-com/ds-graphql';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useOnboardingProcess } from '../../components/OnboardingContainer/OnboadringContainer';

interface UserOnboardingFormData {
  firstName: string;
  lastName: string;
  about?: string;
}

const OnboardingNameForm = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UserOnboardingFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const [loading, setLoading] = useState(false);

  const { user, sub, updateUser, initBusinessStep, updateError } =
    useOnboardingProcess();
  //const [createEntity, { error: createEntityError }] = useMutation(
  //  gql(CREATE_ENTITY)
  //);
  const [updateEntity, { error: updateEntityError }] = useMutation(
    gql(UPDATE_ENTITY)
  );
  const [listEntityUsers, { data: entityUsersData, error: listEntitiesError }] =
    useLazyQuery(gql(LIST_ENTITY_USERS), {
      //variables: {
      //  filter: {
      //    owner: {
      //      eq: sub,
      //    },
      //    type: {
      //      eq: EntityType.INDIVIDUAL,
      //    },
      //  },
      //},
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    });

  const individualEntities = useMemo(
    () =>
      entityUsersData?.entityUsersByUser?.items?.filter(
        (entityUser: any) =>
          entityUser.entity?.type === EntityType.INDIVIDUAL &&
          entityUser.entity?.owner === sub
      ),
    [sub, entityUsersData]
  );

  const inputs = useMemo(
    () => ({
      firstName: {
        label: t('firstNameTitle', { ns: 'common' }),
        placeholder: t('firstNamePlaceholder', { ns: 'common' }),
        name: 'firstName' as const,
        type: 'text',
        defaultValue: '',
        rules: {
          required: t('firstNameRequired', { ns: 'common' }),
        },
      },
      lastName: {
        label: t('lastNameTitle', { ns: 'common' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('lastNamePlaceholder', { ns: 'common' }),
        defaultValue: '',
        rules: {
          required: t('lastNameRequired', { ns: 'common' }),
        },
      },
    }),
    [t]
  );

  useLayoutEffect(() => {
    const retrieve = async () => {
      try {
        await listEntityUsers();
      } catch (err) {
        console.log('ERROR listing entities: ', err);
      }
    };

    retrieve();
  }, [listEntityUsers, location]);

  useEffect(() => {
    if (user.firstName) {
      setValue('firstName', user.firstName, { shouldValidate: true });
    }
    if (user.lastName) {
      setValue('lastName', user.lastName, { shouldValidate: true });
    }
  }, [user, setValue]);

  const onSubmit = async (data: UserOnboardingFormData) => {
    setLoading(true);

    try {
      const [updateUserData] = await Promise.all([
        updateUser({
          variables: {
            input: {
              ...data,
              onboardingStatus: getNextOnboardingStep(user),
              id: sub,
            },
          },
        }),
        //updateUserAttributes(user, data),
      ]);

      const newBusinessName = `${data.firstName} ${data.lastName}`;
      // update existing individual entity
      if (individualEntities?.length > 0) {
        await Promise.all(
          individualEntities.map((entityUser: EntityUser) =>
            updateEntity({
              variables: {
                input: {
                  name: newBusinessName,
                  id: entityUser?.entity?.id,
                },
              },
            })
          )
        );
      }

      setLoading(false);

      const updatedUser = updateUserData?.data?.updateUser;

      initBusinessStep();
      navigate(getOnboardingPath(updatedUser), {
        replace: true,
      });
    } catch (err) {
      console.log('ERROR updating user: ', err);
      setLoading(false);
    }
  };
  const renderErrorAlert = (error: any) => {
    if (error) {
      return <WBAlert title={error.message} severity="error" sx={{ my: 2 }} />;
    }
    return null;
  };

  return (
    <WBFlex
      flexDirection="column"
      alignItems="center"
      width={{
        xs: '100%',
        sm: '80%',
        md: '60%',
        lg: '40%',
      }}
    >
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        <Controller
          control={control}
          name={inputs.firstName.name}
          rules={inputs.firstName.rules}
          defaultValue={inputs.firstName.defaultValue}
          render={({ field }) => (
            <WBBox>
              <WBTextField
                {...field}
                label={inputs.firstName.label}
                type="text"
                placeholder={inputs.firstName.placeholder}
                error={!!(errors.firstName && errors.firstName.message)}
                helperText={
                  (errors.firstName && errors.firstName.message) || ''
                }
                margin="dense"
              />
            </WBBox>
          )}
        />
        <Controller
          control={control}
          name={inputs.lastName.name}
          rules={inputs.lastName.rules}
          defaultValue={inputs.lastName.defaultValue}
          render={({ field }) => (
            <WBBox sx={{ mt: 2 }}>
              <WBTextField
                {...field}
                label={inputs.lastName.label}
                type={inputs.lastName.type}
                placeholder={inputs.lastName.placeholder}
                error={!!(errors.lastName && errors.lastName.message)}
                helperText={
                  ((errors.lastName && errors.lastName.message) as string) || ''
                }
                margin="dense"
              />
            </WBBox>
          )}
        />
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 10,
            },
          }}
          loading={loading}
        >
          {t('nextTitle', { ns: 'common' })}
        </WBButton>
      </WBForm>
      {renderErrorAlert(updateError)}
      {/*{renderErrorAlert(createEntityError)}*/}
      {renderErrorAlert(updateEntityError)}
      {renderErrorAlert(listEntitiesError)}
    </WBFlex>
  );
};

export default OnboardingNameForm;
