import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useMemo } from 'react';
import {
  WBAlert,
  WBButton,
  WBFlex,
  WBForm,
  WBSelect,
  WBTextField,
} from '@admiin-com/ds-web';
import {
  ADMIN_GROUPS,
  ADMIN_GROUP_OPTIONS,
  REGEX,
} from '@admiin-com/ds-common';
import { isEmpty } from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { CSadminFragment } from '@admiin-com/ds-graphql';
import {
  createAdmin as CREATE_ADMIN,
  deleteAdmin as DELETE_ADMIN,
} from '@admiin-com/ds-graphql';
import { getAdmin } from '@admiin-com/ds-graphql';
import { PATHS } from '../../navigation/paths';

const AdminForm = () => {
  const navigate = useNavigate();
  const { adminId } = useParams();
  const { t } = useTranslation();
  const { data: adminData } = useQuery(gql(getAdmin), {
    variables: {
      id: adminId,
    },
    skip: !adminId,
  });
  const [
    createAdmin,
    {
      loading: createLoading,
      data: createData,
      error: createError,
      reset: resetCreate,
    },
  ] = useMutation(gql(CREATE_ADMIN), {
    update(cache, { data }) {
      cache.modify({
        fields: {
          listAdmins(existing = []) {
            const dataRef = cache.writeFragment({
              data: data.createAdmin,
              fragment: gql(CSadminFragment),
            });
            return { items: [existing.items.concat(dataRef)] };
          },
        },
      });
    },
  });

  //const [
  //  updateAdmin,
  //  {
  //    loading: updateLoading,
  //    data: updateData,
  //    error: updateError,
  //    reset: resetUpdate,
  //  },
  //] = useMutation(gql(UPDATE_ADMIN));

  const [
    deleteAdmin,
    {
      loading: deleteLoading,
      data: deleteData,
      error: deleteError,
      reset: resetDelete,
    },
  ] = useMutation(gql(DELETE_ADMIN), {
    update(cache, { data }) {
      const id = data?.deleteAdmin?.id;
      cache.modify({
        fields: {
          listAdmins(existing = []) {
            return {
              items: [existing.items.filter((item: any) => item.id !== id)],
            };
          },
        },
      });
    },
  });

  useEffect(() => {
    console.log('deleteData: ', deleteData);
    if (deleteData?.deleteAdmin?.id) {
      navigate(PATHS.admins, { replace: true });
    }
  }, [deleteData, navigate]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  const adminDetails = adminData?.getAdmin;

  const roleOptions = useMemo(
    () =>
      ADMIN_GROUP_OPTIONS.map((option) => ({
        ...option,
        label: t(option.label, { ns: 'options' }),
      })) || [],
    [t]
  );

  const inputs = useMemo(
    () => ({
      firstName: {
        label: t('firstNameTitle', { ns: 'common' }),
        placeholder: '',
        name: 'firstName',
        type: 'text',
        defaultValue: '',
        rules: {
          required: t('firstNameRequired', { ns: 'common' }),
        },
      },
      lastName: {
        label: t('lastNameTitle', { ns: 'common' }),
        placeholder: '',
        name: 'lastName',
        type: 'text',
        defaultValue: '',
        rules: {
          required: t('lastNameRequired', { ns: 'common' }),
        },
      },
      email: {
        label: t('emailTitle', { ns: 'common' }),
        name: 'email',
        placeholder: '',
        type: 'email',
        defaultValue: '',
        rules: {
          required: t('emailRequired', { ns: 'common' }),
          pattern: {
            value: REGEX.EMAIL,
            message: t('invalidEmail', { ns: 'common' }),
          },
        },
      },
      role: {
        label: t('roleTitle', { ns: 'common' }),
        placeholder: '',
        options: roleOptions,
        name: 'role',
        defaultValue: '',
        rules: {
          required: t('roleRequired', { ns: 'common' }),
        },
      },
    }),
    [roleOptions, t]
  );

  useEffect(() => {
    if (!isEmpty(adminDetails) && adminId) {
      if ('firstName' in adminDetails) {
        setValue('firstName', adminDetails.firstName);
      }
      if ('lastName' in adminDetails) {
        setValue('lastName', adminDetails.lastName);
      }
      if ('email' in adminDetails) {
        setValue('email', adminDetails.email);
      }
      if ('role' in adminDetails) {
        setValue(
          'role',
          ADMIN_GROUPS.find((role) => role === adminDetails.role)
        );
      }
    }
  }, [adminDetails, adminId, setValue]);

  useEffect(() => {
    if (!isEmpty(createData)) {
      reset();
    }
  }, [createData, reset]);

  /**
   * Handle form submit
   */
  const onSubmit = async (data: any) => {
    try {
      await createAdmin({
        variables: {
          input: data,
        },
      });
    } catch (err) {
      console.log('ERROR create admin: ', err);
    }
  };

  /**
   * Delete admin
   */
  const onDelete = async () => {
    const confirm = window.confirm(
      'Are you sure you want to delete this admin?'
    );
    if (confirm) {
      try {
        await deleteAdmin({
          variables: {
            input: {
              id: adminId,
            },
          },
        });
      } catch (err) {
        console.log('ERROR delete admin: ', err);
      }
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
          render={({ field: { ref, ...field } }) => (
            <WBTextField
              {...field}
              type="text"
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
          render={({ field: { ref, ...field } }) => (
            <WBTextField
              {...field}
              type="text"
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
          render={({ field: { ref, ...field } }) => (
            <WBTextField
              {...field}
              disabled={!!adminId}
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

        <Controller
          control={control}
          name={inputs.role.name}
          rules={inputs.role.rules}
          defaultValue={inputs.role.defaultValue}
          render={({ field: { onChange, ref, ...props } }) => (
            <WBSelect
              {...props}
              onChange={(e) => onChange(e?.target?.value)}
              label={inputs.role.label}
              options={inputs.role.options}
              //placeholder={inputs.email.placeholder}
              error={!!(errors.role && errors.role.message)}
              helperText={
                ((errors.role && errors.role.message) as string) || ''
              }
              margin="dense"
            />
          )}
        />

        {(!isEmpty(createError) || !isEmpty(deleteError)) && (
          <WBAlert
            title={createError?.message || deleteError?.message}
            severity="error"
            sx={{ my: 2 }}
          />
        )}

        <WBFlex>
          {!adminId && (
            <WBButton
              loading={createLoading}
              onClick={handleSubmit(onSubmit)}
              sx={{
                mt: 1,
              }}
            >
              {adminId ? 'Update' : 'Create'}
            </WBButton>
          )}
          {adminId && (
            <WBButton
              loading={deleteLoading}
              type="button"
              color="error"
              onClick={onDelete}
              sx={{
                mt: 1,
                ml: 1,
              }}
            >
              Remove
            </WBButton>
          )}
        </WBFlex>
      </WBForm>
      {!isEmpty(createData) && (
        <WBAlert
          title={t('createdSuccessfully', { ns: 'common' })}
          severity="success"
          onClose={resetCreate}
          sx={{ mt: 2 }}
        />
      )}

      {/*{!isEmpty(updateData) && (*/}
      {/*  <WBAlert*/}
      {/*    title={t("updatedSuccessfully", { ns: "common" })}*/}
      {/*    severity="success"*/}
      {/*    onClose={resetCreate}*/}
      {/*    sx={{ mt: 2 }}*/}
      {/*  />*/}
      {/*)}*/}

      {!isEmpty(deleteData) && (
        <WBAlert
          title={t('deletedSuccessfully', { ns: 'common' })}
          severity="success"
          onClose={resetDelete}
          sx={{ mt: 2 }}
        />
      )}
    </>
  );
};

export default AdminForm;
