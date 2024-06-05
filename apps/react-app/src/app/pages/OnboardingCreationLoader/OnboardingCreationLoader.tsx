import {
  wbBounce,
  WBBox,
  WBContainer,
  //WBFade,
  WBGradientBox,
  WBTypography,
} from '@admiin-com/ds-web';
import { useTheme } from '@mui/material';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import * as reactSpring from '@react-spring/three';
// import * as drei from '@react-three/drei';
interface FinalOnboardingProps {
  splashTime?: number;
}
const OnboardingCreationLoader = ({
  splashTime = 7000,
}: FinalOnboardingProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard'); // Replace '/dashboard' with the actual path to your dashboard
    }, splashTime); // 3000 milliseconds = 3 seconds

    // Cleanup function to clear the timer if the component unmounts before 5 seconds
    return () => clearTimeout(timer);
  }, [navigate, splashTime]);
  const theme = useTheme();

  return (
    <WBContainer
      maxWidth="sm"
      fixed
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh', // Full height of the viewport
      }}
    >
      <WBGradientBox
        sx={{
          width: { xs: '100%', sm: '600px' }, // 100% width on xs (mobile), 800px on sm and above
          height: { xs: '100vh', sm: '600px' }, // 100% viewport height on xs (mobile), 500px on sm and above
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WBBox
          sx={{
            position: 'relative',
            width: 120,
            height: 120,
            marginBottom: 6,
          }}
        >
          <WBBox
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'common.white',
              borderRadius: '50%',
              position: 'absolute',
              left: '10%',
              top: '10%',
              animation: `${wbBounce} 1s linear  infinite`,
            }}
          />
          <WBBox
            sx={{
              width: 0,
              height: 0,
              borderLeft: '40px solid transparent',
              borderRight: '40px solid transparent',
              borderBottom: `60px solid ${theme.palette.common.white}`,
              position: 'absolute',
              left: '50%',
              top: '50%',
              animation: `${wbBounce} 1s linear  infinite`,
              animationDelay: '0.5s',
            }}
          />
        </WBBox>

        {/*<WBFade>*/}
        <WBTypography variant="h3" color={'white'}>
          {t('createYourAccount', { ns: 'onboarding' })}
        </WBTypography>
        {/*</WBFade>*/}
        <WBTypography variant="subtitle1" color={'white'}>
          {t('pleaseHold', { ns: 'onboarding' })}
        </WBTypography>
      </WBGradientBox>
    </WBContainer>
  );
};

export default OnboardingCreationLoader;
