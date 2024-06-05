import { EnumEntityType } from '/opt/frankieone/frankieone.types';

export const FrankieOneEntityTypeMap = {
  SOLE_TRADER: EnumEntityType.INDIVIDUAL,
  PARTNERSHIP: EnumEntityType.INDIVIDUAL, //TODO: entity type for partnership?
  COMPANY: EnumEntityType.ORGANISATION,
  INDIVIDUAL: EnumEntityType.INDIVIDUAL,
  TRUST: EnumEntityType.TRUST,
  NOT_FOR_PROFIT: EnumEntityType.ORGANISATION,
  SELF_MANAGED_SUPER_FUND: EnumEntityType.TRUST,
  BPAY: EnumEntityType.ORGANISATION, //TODO: COULD BE VARIOUS?
};
