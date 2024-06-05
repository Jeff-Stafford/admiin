import {
  AutocompleteResult,
  Contact,
  ContactGuest,
  Entity,
  EntityGuest,
} from '@admiin-com/ds-graphql';

export const getContactName = (contact: Contact | null | undefined) => {
  if (!contact) return '';
  return `${contact.companyName || `${contact.firstName} ${contact.lastName}`}`;
};
export const getName = (
  contact:
    | AutocompleteResult
    | Contact
    | Entity
    | ContactGuest
    | EntityGuest
    | null
    | undefined
) => {
  if (!contact) return '';
  if ('label' in contact) return contact.label;
  if ('companyName' in contact) {
    return getContactName(contact as Contact);
  }
  if ('role' in contact && 'firstName' in contact && 'lastName' in contact) {
    return `${contact.firstName} ${contact.lastName}`;
  } else return contact.name ?? '';
};
