import { OnboardingStatus, User } from '@admiin-com/ds-graphql';

/**
 * Gets the next step of onboarding based on user type
 * @param user
 */
export const getNextOnboardingStep = (user: User) => {
  const { onboardingStatus } = user;
  switch (onboardingStatus) {
    case OnboardingStatus.PROFILE:
      return OnboardingStatus.BUSINESS;
    case OnboardingStatus.BUSINESS:
      //  return OnboardingStatus.PLANS;
      //case OnboardingStatus.PLANS:
      return OnboardingStatus.COMPLETED;
    default:
      return OnboardingStatus.COMPLETED;
  }
};
export const getPrevOnboardingStep = (user: User) => {
  const { onboardingStatus } = user;
  switch (onboardingStatus) {
    case OnboardingStatus.BUSINESS:
      return OnboardingStatus.PROFILE;
    //case OnboardingStatus.PLANS:
    //  return OnboardingStatus.BUSINESS;
    case OnboardingStatus.COMPLETED:
      return OnboardingStatus.BUSINESS;
    //return OnboardingStatus.PLANS;
    default:
      return OnboardingStatus.PROFILE;
  }
};
