import { WBFlex, WBTypography } from '@admiin-com/ds-web';
import GradientOuter from '../../../assets/images/onboarding-gradient-inner.png';
import GradientOuterx2 from '../../../assets/images/onboarding-gradient-inner@2x.png';
import GradientOuterx3 from '../../../assets/images/onboarding-gradient-inner@3x.png';

import GradientInner from '../../../assets/images/onboarding-gradient-outer.png';
import GradientInnerx2 from '../../../assets/images/onboarding-gradient-outer@2x.png';
import GradientInnerx3 from '../../../assets/images/onboarding-gradient-outer@3x.png';
import { useTranslation } from 'react-i18next';

export function SignInLogo() {
  const { t } = useTranslation();
  return (
    <WBFlex
      flex={1}
      alignItems="center"
      justifyContent="center"
      m={8}
      padding={8}
      sx={{
        backgroundImage: `url(${GradientOuter})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)':
          {
            backgroundImage: `url(${GradientOuterx2})`, // High resolution background
          },
        '@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi)':
          {
            backgroundImage: `url(${GradientOuterx3})`, // Super high resolution background
          },
      }}
    >
      <WBFlex
        flex={1}
        width="100%"
        height="100%"
        p={6}
        sx={{
          backgroundImage: `url(${GradientInner})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)':
            {
              backgroundImage: `url(${GradientInnerx2})`, // High resolution background
            },
          '@media (-webkit-min-device-pixel-ratio: 3), (min-resolution: 288dpi)':
            {
              backgroundImage: `url(${GradientInnerx3})`, // Super high resolution background
            },
        }}
      >
        <WBFlex flex={1} alignItems="flex-end">
          <WBTypography
            //variant="h1"
            fontSize={36}
            lineHeight={0.85}
            fontWeight={800}
            color="white"
            textTransform="uppercase"
          >
            {t('description', { ns: 'signIn' })}
          </WBTypography>
        </WBFlex>
      </WBFlex>
    </WBFlex>
  );
}
