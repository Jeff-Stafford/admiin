import { WBFab, WBIcon } from '@admiin-com/ds-web';
import { useLocation } from 'react-router-dom';
import { PATHS } from '../../navigation/paths';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton = (props: BackButtonProps) => {
  const { pathname } = useLocation();
  const isShown =
    pathname !== PATHS.onboardingComplete && pathname !== PATHS.onboardingName;

  return isShown ? (
    <WBFab
      sx={{
        top: 35,
        left: {
          xs: 0,
          sm: 45,
        },
        position: 'absolute',
      }}
      onClick={() => props.onClick()}
    >
      <WBIcon name="ArrowBack" size={'small'} />
    </WBFab>
  ) : null;
};
