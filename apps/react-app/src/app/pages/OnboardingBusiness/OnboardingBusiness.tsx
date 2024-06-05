import OnboardingBusinessCreate from './BusinessCreate/OnboardingBusinessCreate';
import OnboardingBusinessAddressLookup from './BusinessAddress/OnboardingBusinessAddress';
import OnboardingBusinessLogo from './BusinessLogo/OnboardingBusinessLogo';
import { BackButton } from '../../components/BackButton/BackButton';
import { WBBox } from '@admiin-com/ds-web';
import {
  OnboardingBusinessStep,
  useOnboardingProcess,
} from '../../components/OnboardingContainer/OnboadringContainer';
import PageSelector from '../../components/PageSelector/PageSelector';

const OnboardingBusiness = () => {
  const { currentBusinessStep, gotoPrev } = useOnboardingProcess();

  return (
    <WBBox sx={{ position: 'relative' }}>
      <PageSelector current={currentBusinessStep}>
        <PageSelector.Page value={OnboardingBusinessStep.ADD_BUSINESS}>
          <OnboardingBusinessCreate />
        </PageSelector.Page>
        <PageSelector.Page value={OnboardingBusinessStep.BUSINESS_ADDRESS}>
          <OnboardingBusinessAddressLookup />
        </PageSelector.Page>
        <PageSelector.Page value={OnboardingBusinessStep.BUSINESS_LOGO}>
          <OnboardingBusinessLogo />
        </PageSelector.Page>
      </PageSelector>
      <BackButton onClick={gotoPrev} />
    </WBBox>
  );
};

export default OnboardingBusiness;
