import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import {
  Contact,
  ContactStatus,
  getContact as GET_CONTACT,
  contactsByEntity as CONTACTS_BY_ENTITY,
  updateContact as UPDATE_CONTACT,
  tasksByEntityByIdContactId as TASKS_BY_ENTITY_BY_CONTACT_ID,
  TaskSearchStatus,
  TaskDirection,
  Task,
  TaskStatus,
} from '@admiin-com/ds-graphql';
import {
  WBBox,
  WBFlex,
  WBIconButton,
  WBMenu,
  WBMenuItem,
  WBStack,
  WBSvgIcon,
  WBTypography,
  useSnackbar,
} from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import DotIcon from '../../../assets/icons/tripledot.svg';
import { CurrencyNumber } from '../CurrencyNumber/CurrencyNumber';
import { useTheme } from '@mui/material';
import { ContactsCreateForm } from './ContactsCreateForm';
import React, { useEffect } from 'react';
import ContactFiles from '../ContactFiles/ContactFiles';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useCurrentEntityId } from '../../hooks/useSelectedEntity/useSelectedEntity';

export interface ContactDetailProps {
  contact: Contact | null;
  onCreated?: (contact: Contact | null) => void;
}
export const cloneContactWithSearchName = (contact: Contact) => ({
  ...contact,
  searchName: `${
    contact.companyName || `${contact.firstName} ${contact.lastName}`
  }`,
});
export function ContactDetail({
  contact: selectedContact,
  onCreated,
}: ContactDetailProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const [contact, setContact] = React.useState<Contact | null>();
  useEffect(() => {
    setContact(
      selectedContact ? cloneContactWithSearchName(selectedContact) : null
    );
  }, [selectedContact]);

  const { data: contactData } = useQuery(
    gql`
      ${GET_CONTACT}
    `,
    {
      variables: {
        id: contact?.id,
      },
      skip: !contact || !contact?.id,
    }
  );

  const contactDetail = React.useMemo(
    () => contactData?.getContact,
    [contactData]
  );
  console.log(contactDetail);

  const entityId = useCurrentEntityId();
  const [filesType, setFilesType] = React.useState<'Outstanding' | 'Complete'>(
    'Outstanding'
  );

  const [tasksByEntityByIdContactId, { data, error }] = useLazyQuery(
    gql(TASKS_BY_ENTITY_BY_CONTACT_ID)
  );
  React.useLayoutEffect(() => {
    if (entityId && contact?.id) {
      tasksByEntityByIdContactId({
        variables: {
          entityIdBy: entityId,
          filter: {
            status: {
              eq:
                filesType === 'Outstanding'
                  ? TaskStatus.INCOMPLETE
                  : TaskStatus.COMPLETED,
            },
          },
          status:
            filesType === 'Outstanding'
              ? TaskSearchStatus.INCOMPLETE
              : TaskSearchStatus.COMPLETED,
          contactId: contact.id,
        },
      });
    }
  }, [filesType, contact?.id, entityId]);

  const tasks = data?.tasksByEntityByIdContactId?.items ?? [null, null];

  const totalReceivable = tasks?.reduce(
    (amount: number, task: Task) =>
      amount +
      ((task?.direction === TaskDirection.RECEIVING ? task?.amount : 0) || 0),
    0
  );
  const totalPayable = tasks?.reduce(
    (amount: number, task: Task) =>
      amount +
      ((task?.direction === TaskDirection.SENDING ? task?.amount : 0) || 0),
    0
  );

  const handleFormSubmitted = (updatedContact: Contact) => {
    if (!contact) {
      onCreated && onCreated(updatedContact);
    } else {
      setContact(cloneContactWithSearchName(updatedContact));
    }
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [updateContact] = useMutation(gql(UPDATE_CONTACT));

  const showSnackbar = useSnackbar();
  const handleArchiveContact = async () => {
    handleMenuClose();
    if (contact) {
      try {
        await updateContact({
          variables: {
            input: {
              id: contact.id,
              entityId,
              status: ContactStatus.ARCHIVED,
            },
          },

          update: (cache, { data: { updateContact } }) => {
            cache.modify({
              id: cache.identify({ ...updateContact }),
              fields: {
                status(oldValue) {
                  return ContactStatus.ARCHIVED;
                },
              },
            });
          },
        });
        onCreated && onCreated(null);
        showSnackbar({
          message: t('contactArchived', { ns: 'contacts' }),
          severity: 'success',
          horizontal: 'center',
          vertical: 'bottom',
        });
      } catch (error: any) {
        showSnackbar({
          title: t('contactArchivedFailed', { ns: 'contacts' }),
          message: error?.message,
          severity: 'error',
          horizontal: 'center',
          vertical: 'bottom',
        });
      }
    }
  };

  return (
    <WBFlex
      flexDirection="column"
      justifyContent={'start'}
      mt={4}
      maxWidth="100%"
    >
      {contact ? (
        <>
          <WBFlex justifyContent={'space-between'}>
            <WBFlex alignItems={'center'}>
              <WBS3Avatar
                sx={{
                  borderRadius: '3px',
                  minWidth: 56,
                  height: 56,
                }}
                companyName={contact.searchName ?? ''}
                fontSize="h6.fontSize"
              />
              <WBTypography
                variant="h2"
                mb={0}
                ml={2}
                noWrap
                component="div"
                color="dark"
              >
                {contact.searchName ?? ''}
              </WBTypography>
            </WBFlex>
            <WBFlex
              alignItems={'center'}
              sx={{ mt: { xs: -9, lg: 0 }, ml: { xs: -6, lg: 0 } }}
            >
              <WBIconButton onClick={handleOpenMenu}>
                <WBSvgIcon fontSize="small">
                  <DotIcon />
                </WBSvgIcon>
              </WBIconButton>
            </WBFlex>
          </WBFlex>
          <WBStack direction={'row'} spacing={3} mt={{ md: 7, xs: 4 }}>
            <WBBox>
              <WBTypography variant="h5">
                {t('totalReceivable', { ns: 'contacts' })}
              </WBTypography>
              <CurrencyNumber
                color="primary"
                // fontFamily="Nexa"
                number={totalReceivable / 100}
                sup={false}
              />
            </WBBox>
            <WBBox>
              <WBTypography variant="h5">
                {t('totalPayable', { ns: 'contacts' })}
              </WBTypography>

              <CurrencyNumber
                color="primary"
                // fontFamily="Nexa"
                number={totalPayable / 100}
                sup={false}
              />
            </WBBox>
          </WBStack>

          {contact ? (
            <ContactFiles
              tasks={tasks}
              contact={contact}
              filesType={filesType}
              setFilesType={setFilesType}
            />
          ) : null}
          <WBMenu
            sx={{ mt: -2 }}
            id="customized-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <WBMenuItem
              onClick={handleArchiveContact}
              sx={{ ...theme.typography.body2, fontWeight: 'bold' }}
            >
              {t('archiveContact', { ns: 'contacts' })}
            </WBMenuItem>
          </WBMenu>
        </>
      ) : null}
      <ContactsCreateForm
        selected={contact}
        onSubmitted={handleFormSubmitted}
      />
    </WBFlex>
  );
}

export default ContactDetail;
