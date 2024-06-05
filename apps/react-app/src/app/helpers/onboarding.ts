import { OnboardingStatus, User } from '@admiin-com/ds-graphql';
import { PATHS } from '../navigation/paths';

export const getOnboardingPath = (input: User | OnboardingStatus) => {
  let onboardingStatus: OnboardingStatus | null | undefined;

  // Check if 'input' is a User object by checking for a specific property
  if (input && typeof input === 'object' && 'onboardingStatus' in input) {
    onboardingStatus = input.onboardingStatus;
  } else {
    onboardingStatus = input as OnboardingStatus;
  }

  switch (onboardingStatus) {
    case OnboardingStatus.PROFILE:
      return PATHS.onboardingName;

    // case OnboardingStatus.PROFILE_IMAGE:
    //   return PATHS.onboardingProfileImage;

    case OnboardingStatus.BUSINESS:
      return PATHS.onboardingBusiness;

    //case OnboardingStatus.PLANS:
    //  return PATHS.onboardingPlans;

    case OnboardingStatus.COMPLETED:
      return PATHS.dashboard;

    default:
      return PATHS.dashboard;
  }
};
