import React from 'react';
import { WBFullScreenModal } from '@admiin-com/ds-web';
import { useTranslation } from 'react-i18next';
import { ContactsCreateForm } from '../../components/ContactDetail/ContactsCreateForm';
import { Contact } from '@admiin-com/ds-graphql';
interface BulkImportProps {
  open: boolean;
  entityId?: string;
  onSuccess?: (contact: Contact) => void;
  handleCloseModal: () => void;
}

export type PageType = 'Upload' | 'Map';

export function ContactCreateModal({
  open,
  onSuccess,
  entityId,
  handleCloseModal,
}: BulkImportProps) {
  const { t } = useTranslation();

  return (
    <WBFullScreenModal
      leftToolbarIconProps={{
        onClick: () => handleCloseModal(),
      }}
      leftToolbarIconTitle={t('back', { ns: 'contacts' })}
      onClose={handleCloseModal}
      title={t('createContact', { ns: 'contacts' })}
      open={open}
    >
      <ContactsCreateForm
        entityId={entityId}
        onSubmitted={(contact) => {
          onSuccess && onSuccess(contact);
          handleCloseModal();
        }}
      />
    </WBFullScreenModal>
  );
}
