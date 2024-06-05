import { STREET_TYPES_AUSTRALIA } from '@admiin-com/ds-common';
import {
  Contact,
  Entity,
  EntityType,
  FromToType,
  VerificationStatus,
} from '@admiin-com/ds-graphql';

export function isVerifiedEntity(entity: Entity) {
  return (
    entity?.verificationStatus === VerificationStatus.PASS ||
    entity?.verificationStatus === VerificationStatus.PASS_MANUAL
  );
}

export function isVerifiedBeneficialOwner(entity: Entity) {
  // for()
}

export function isIndividualEntity(business: Entity | null | undefined) {
  return (
    business?.type === EntityType.INDIVIDUAL ||
    business?.type === EntityType.SOLE_TRADER
  );
}

export function isEntityOrContact(business: Entity | Contact) {
  if ('entityId' in business) return FromToType.CONTACT;
  else return FromToType.ENTITY;
}

export const mapStreetType = (address: string): string | null => {
  const addressParts = address?.split(' ') ?? [];

  for (const part of addressParts) {
    if (STREET_TYPES_AUSTRALIA.includes(part)) {
      return part;
    }
  }

  return null;
};
