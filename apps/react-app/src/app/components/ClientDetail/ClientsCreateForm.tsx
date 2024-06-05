import {
  WBButton,
  WBFlex,
  WBForm,
  WBTypography,
  useMediaQuery,
  useSnackbar,
} from '@admiin-com/ds-web';
import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  ClientInput,
  Contact,
  CreateEntityInput,
  CSGetSelectedEntityId as GET_SELECTED_ENTITY_ID,
  createClient as CREATE_CLIENT,
  entityUsersByUser as LIST_ENTITY_USERS,
  Entity,
} from '@admiin-com/ds-graphql';
import { useTheme } from '@mui/material';
import { useUpdateContact } from '../../hooks/useUpdateContact/useUpdateContact';
import ErrorHandler from '../ErrorHandler/ErrorHandler';
import ContactForm from '../ContactForm/ContactForm';
import EntityCreateForm from '../EntityCreateForm/EntityCreateForm';
import { useSelectedEntity } from '../../hooks/useSelectedEntity/useSelectedEntity';
export interface ContactCreateFormData {
  client: Contact & {
    address: string;
  };
}

interface ContactDetailFormProps {
  selected?: (Contact & { entity?: Entity }) | null;
  onSubmitted?: (contact: Contact) => void;
}
export type CreateEntityForm =
  | (CreateEntityInput & {
      hasABN: boolean;
      addressText: string;
    })
  | null;
export type CreateClientForm = {
  client: ClientInput;
  entity: CreateEntityForm;
};

export function ClientsCreateForm({
  selected = null,
  onSubmitted,
}: ContactDetailFormProps) {
  const { t } = useTranslation();
  const methods = useForm<CreateClientForm>({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = methods;

  const [loading, setLoading] = useState(false);

  const [createClient, { error: createError }] = useMutation(
    gql(CREATE_CLIENT),
    {
      refetchQueries: [gql(LIST_ENTITY_USERS)],
    }
  );
  const [updateContact, { error: updateError }] = useUpdateContact();

  const { data: selectedEntityIdData } = useQuery(gql(GET_SELECTED_ENTITY_ID));

  const { entity } = useSelectedEntity();
  const entityId = selectedEntityIdData?.selectedEntityId;

  useEffect(() => {
    if (!selected) {
      reset();
    }
  }, [reset, selected]);

  useEffect(() => {
    if (selected) {
      setValue('client.firstName', selected.firstName ?? '');
      setValue('client.lastName', selected.lastName ?? '');
      setValue('client.phone', selected.phone ?? '');
      setValue('client.email', selected.email ?? '');
      if (selected.entity) {
        setValue('entity.type', selected.entity.type);
        setValue('entity.name', selected.entity.name);
        setValue(
          'entity.address.address1',
          selected.entity.address?.address1 ?? ''
        );
        setValue('entity.taxNumber', selected.entity.taxNumber);
      }
    }
  }, [selected, setValue]);

  const showSnackbar = useSnackbar();
  const onSubmit = async (data: CreateClientForm) => {
    setLoading(true);
    try {
      const client: ClientInput = {
        ...data.client,
        name: data.client.firstName ?? '' + ' ' + data.client.lastName ?? '',
      };
      const entity = data.entity;

      if (selected) {
        const updatedContact = await updateContact({
          variables: {
            input: {
              ...client,
              id: selected.id,
            },
          },
        });
        onSubmitted && onSubmitted(updatedContact?.data.updateContact);
      } else {
        const createdContact = await createClient({
          variables: {
            input: { entityId, client, entity },
          },
        });
        onSubmitted && onSubmitted(createdContact?.data.createContact);

        showSnackbar({
          message: t('clientCreated', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'right',
          vertical: 'bottom',
        });
      }

      setLoading(false);
    } catch (err) {
      console.log('error updating entity: ', err);
      setLoading(false);
    }
  };
  const theme = useTheme();

  const islg = useMediaQuery(theme.breakpoints.down('lg'));

  const notAbleToCreate = selected === null && !entity?.clientsEnabled;
  // if (notAbleToCreate) {
  //   return null; //<WBTypography>Clients are not enabled for this entity</WBTypography>;
  // }

  //@ts-ignore
  return (
    <WBFlex flexDirection="column" alignItems="center" mb={4}>
      <WBForm onSubmit={handleSubmit(onSubmit)} alignSelf="stretch">
        <FormProvider {...methods}>
          <WBTypography
            variant={islg ? 'h3' : 'h2'}
            noWrap
            component="div"
            color="dark"
            sx={{ flexGrow: 1, textAlign: 'left' }}
          >
            {t('clientDetails', { ns: 'contacts' })}
          </WBTypography>
          <ContactForm disabled={selected !== null} />
          <WBTypography
            variant={islg ? 'h3' : 'h2'}
            noWrap
            mt={5}
            component="div"
            color="dark"
            sx={{ flexGrow: 1, textAlign: 'left' }}
          >
            {t('entityDetails', { ns: 'contacts' })}
          </WBTypography>
          <EntityCreateForm hasIndividual />
        </FormProvider>
        <WBButton
          sx={{
            mt: {
              xs: 6,
              sm: 8,
            },
          }}
          loading={loading}
        >
          {t(`${selected ? 'updateClient' : 'createClient'}`, {
            ns: 'contacts',
          })}
        </WBButton>
      </WBForm>
      <ErrorHandler errorMessage={createError?.message} />
      <ErrorHandler errorMessage={updateError?.message} />
    </WBFlex>
  );
}
