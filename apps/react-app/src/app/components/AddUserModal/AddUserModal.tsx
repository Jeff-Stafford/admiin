import {
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
} from '@mui/material';
import SimpleDrawDlg from '../SimpleDrawDlg/SimpleDrawDlg';
import { useTranslation } from 'react-i18next';
import {
  WBButton,
  WBForm,
  WBIcon,
  WBRadio,
  WBTextField,
  useSnackbar,
} from '@admiin-com/ds-web';
import { Controller, useForm } from 'react-hook-form';
import React from 'react';
import { REGEX } from '@admiin-com/ds-common';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import {
  createEntityUser as CREATE_ENTITY_USER,
  CreateEntityUserRole,
  entityUsersByEntityId as ENTITY_USERS_BY_ENTITY_ID,
} from '@admiin-com/ds-graphql';
import { CSGetSub as GET_SUB } from '@admiin-com/ds-graphql';
import { gql, useMutation, useQuery } from '@apollo/client';

import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';

/* eslint-disable-next-line */
export interface AddUserModalProps {
  open: boolean;
  handleClose: () => void;
}

type CreateUserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  role: CreateEntityUserRole;
};

export function AddUserModal({ open, handleClose }: AddUserModalProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const inputs = React.useMemo(
    () => ({
      firstName: {
        label: t('firstName', { ns: 'contacts' }),
        name: 'firstName' as const,
        type: 'text',
        placeholder: t('John', { ns: 'contacts' }),
        defaultValue: '',
        rules: { required: t('firstNameRequired', { ns: 'contacts' }) },
      },
      lastName: {
        label: t('lastName', { ns: 'contacts' }),
        name: 'lastName' as const,
        type: 'text',
        placeholder: t('Smith', { ns: 'contacts' }),
        defaultValue: '',
        rules: { required: t('lastNameRequired', { ns: 'contacts' }) },
      },
      email: {
        label: t('email', { ns: 'contacts' }),
        name: 'email' as const,
        type: 'email',
        defaultValue: '',
        placeholder: t('hello@email.com', { ns: 'contacts' }),
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      role: {
        label: t('role', { ns: 'settings' }),
        name: 'role' as const,
        type: 'text',
        defaultValue: CreateEntityUserRole.ACCOUNTANT,
        rules: {
          required: t('roleRequired', { ns: 'settings' }),
        },
      },
    }),
    [t]
  );
  const entityId = useCurrentEntityId();
  const [createEntityUser, { error: createError }] = useMutation(
    gql(CREATE_ENTITY_USER),
    {
      refetchQueries: [
        {
          query: gql(ENTITY_USERS_BY_ENTITY_ID),
          variables: { entityId },
        },
      ],
    }
  );

  const { data: subData } = useQuery(gql(GET_SUB));

  const [loading, setLoading] = React.useState(false);
  const showSnackbar = useSnackbar();

  const onSubmit = async (data: CreateUserFormData) => {
    setLoading(true);
    try {
      if (entityId) {
        await createEntityUser({
          variables: {
            input: {
              entityId,
              userId: subData?.sub,
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              role: data.role,
            },
          },
        });
        showSnackbar({
          message: t('entityUserCreated', { ns: 'settings' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
        reset();
        handleClose();
      }
    } catch (err) {
      console.log('error updating entity: ', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <SimpleDrawDlg
      open={open}
      handleClose={handleClose}
      maxWidth={'xs'}
      fullWidth={true}
    >
      <DialogTitle variant="h3" fontWeight={'bold'}>
        {t('addUser', {
          ns: 'settings',
        })}
      </DialogTitle>
      <DialogContent>
        <WBForm onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name={inputs.firstName.name}
            rules={inputs.firstName.rules}
            defaultValue={inputs.firstName.defaultValue}
            render={({ field }) => (
              <WBTextField
                {...field}
                type={inputs.firstName.type}
                variant="standard"
                label={inputs.firstName.label}
                placeholder={inputs.firstName.placeholder}
                error={!!errors?.firstName}
                helperText={errors?.firstName?.message || ''}
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
                type={inputs.lastName.type}
                variant="standard"
                label={inputs.lastName.label}
                placeholder={inputs.lastName.placeholder}
                error={!!errors?.lastName}
                helperText={errors?.lastName?.message || ''}
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
                variant="standard"
                label={inputs.email.label}
                placeholder={inputs.email.placeholder}
                error={!!errors?.email}
                helperText={errors?.email?.message || ''}
              />
            )}
          />

          <Controller
            control={control}
            name={inputs.role.name}
            rules={inputs.role.rules}
            defaultValue={inputs.role.defaultValue}
            render={({ field }) => (
              <FormControl sx={{ mt: 3 }}>
                <FormLabel sx={{ verticalAlign: 'center' }}>
                  {inputs.role.label}
                  &nbsp;
                  <WBIcon
                    size={2}
                    library="ioniconSharp"
                    name="InformationCircle"
                  />
                </FormLabel>
                <RadioGroup row {...field}>
                  {Object.values(CreateEntityUserRole).map((value) => (
                    <FormControlLabel
                      value={value}
                      control={<WBRadio size="small" />}
                      sx={{ marginRight: 2, fontSize: 'body2.fontSize' }}
                      label={t(value, { ns: 'settings' })}
                      key={value}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />

          <WBButton
            sx={{
              mt: {
                xs: 4,
                sm: 6,
              },
            }}
            loading={loading}
          >
            {t('addUser', {
              ns: 'settings',
            })}
          </WBButton>
        </WBForm>
        <ErrorHandler errorMessage={createError?.message} />
      </DialogContent>
    </SimpleDrawDlg>
  );
}

export default AddUserModal;
