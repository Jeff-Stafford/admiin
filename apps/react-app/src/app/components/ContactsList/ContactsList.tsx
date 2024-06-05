import React, { useEffect } from 'react';
import { WBBox, WBList, WBNoResults } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { ContactsListItem } from './ContactsListItem';
import { Contact } from '@admiin-com/ds-graphql';
import { useInfiniteScroll } from '@admiin-com/ds-hooks';

interface ContactsListProps {
  contacts?: Contact[];
  loading?: boolean;
  selected: Contact | null;
  query: string;
  hasNextPage?: boolean;
  handleLoadMore?: () => void;
  onClick?: (contact: Contact | null) => void;
  onAddClick?: () => void;
}

export function ContactsList({
  contacts,
  loading = false,
  selected,
  query,
  handleLoadMore,
  hasNextPage,
  onClick,
  onAddClick,
}: ContactsListProps) {
  const { t } = useTranslation();
  const [selectedContact, setSelectedContact] = React.useState<Contact | null>(
    selected
  );

  useEffect(() => {
    if (selected?.id !== selectedContact?.id) {
      setSelectedContact(selected);
    }
  }, [selected, selectedContact]);

  const handleContactSelected = (contact: Contact | null) => {
    //if (contact && selectedContact && contact.id === selectedContact.id) {
    //  setSelectedContact(null);
    //  onClick && onClick(null);
    //} else {
    setSelectedContact(contact);
    onClick && onClick(contact);
    //}
  };

  const lastElementRef = useInfiniteScroll({
    fetchMore: handleLoadMore,
    loading,
    hasNextPage: hasNextPage ?? false,
  });
  const listRef = React.useRef<HTMLDivElement>(null); // Ref for the list container

  return (
    <WBBox
      sx={{
        //backgroundColor: '#FFFFFF',
        boxShadow: '0 1px 22px 0 rgba(0, 0, 0, 0.08)',
        zIndex: 1, // Adjust z-index
        position: 'relative',
        flexGrow: 1,
        overflow: 'overlay',
      }}
      ref={listRef}
    >
      <WBList>
        {contacts?.map((contact, index) => (
          <ContactsListItem
            key={index}
            ref={index === contacts.length - 1 ? lastElementRef : null}
            selected={selectedContact?.id === contact.id}
            contact={contact}
            onClick={handleContactSelected}
          />
        ))}
      </WBList>
      {!loading && contacts && contacts?.length === 0 ? (
        <WBBox sx={{ display: { xs: 'block', lg: 'none' } }}>
          <WBNoResults
            title={
              query
                ? t('noResultsTitle', { ns: 'common' })
                : t('addAContact', { ns: 'contacts' })
            }
            description={
              query
                ? t('noResultsFound', { ns: 'common' })
                : t('addAContactDescription', { ns: 'contacts' })
            }
            btnTitle="Add contact"
            onClick={!query ? onAddClick : undefined}
          />
        </WBBox>
      ) : null}
      {(loading || !contacts) && (
        <WBList>
          {Array.from({ length: 5 }).map((_, index) => (
            <ContactsListItem key={index} contact={null} />
          ))}
        </WBList>
      )}
    </WBBox>
  );
}
