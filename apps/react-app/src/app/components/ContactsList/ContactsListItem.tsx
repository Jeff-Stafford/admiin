import { WBS3Avatar } from '@admiin-com/ds-amplify-web';
import { Contact } from '@admiin-com/ds-graphql';
import {
  WBListItem,
  WBListItemAvatar,
  WBListItemText,
} from '@admiin-com/ds-web';
import { ListItemButton, Skeleton } from '@mui/material';
import React from 'react';

interface ContactListItemProps {
  contact?: Contact | null;
  selected?: boolean;
  onClick?: (contact: Contact) => void;
}

export const ContactsListItem = React.forwardRef<
  HTMLDivElement,
  ContactListItemProps
>(({ contact, selected = false, onClick }, ref) => {
  const companyName =
    contact?.companyName ?? `${contact?.firstName} ${contact?.lastName}`;
  return (
    <ListItemButton
      ref={ref}
      sx={{
        '&:hover': {
          bgcolor: `rgba(0,0,0,0.1)`,
        },
        bgcolor: selected ? `rgba(0,0,0,0.1)` : 'transparent',
        px: 5,
      }}
      onClick={() => contact && onClick && onClick(contact)}
    >
      <WBListItem
        disablePadding
        //secondaryAction={
        //  contact?.contactType === ContactType.CLIENT ? (
        //    <WBChip label={t('client', { ns: 'contacts' })} />
        //  ) : null
        //}
      >
        <WBListItemAvatar>
          {contact ? (
            <WBS3Avatar
              sx={{
                borderRadius: '3px',
              }}
              companyName={companyName}
              fontSize="h6.fontSize"
            />
          ) : (
            <Skeleton width={40} height={40} />
          )}
        </WBListItemAvatar>

        {contact ? (
          <WBListItemText
            primary={companyName}
            secondary={contact?.email}
            primaryTypographyProps={{ fontWeight: 'bold' }}
            secondaryTypographyProps={{ color: 'text.primary' }}
          />
        ) : (
          <WBListItemText>
            <Skeleton width={100} />
          </WBListItemText>
        )}
      </WBListItem>
    </ListItemButton>
  );
});
