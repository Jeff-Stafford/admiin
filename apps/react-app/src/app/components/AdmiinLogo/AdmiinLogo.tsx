import { useTheme } from '@mui/material';
import DarkLogo from '../../../assets/icons/dark_logo.svg';
import LightLogo from '../../../assets/icons/admiin-logo.svg';
import ColorLogoWhite from '../../../assets/icons/admiin-logo-colour-white.svg';
import ColorLogoDark from '../../../assets/icons/admiin-logo-colour.svg';

/* eslint-disable-next-line */
export interface AdmiinLogoProps {}

export function AdmiinLogo(props: AdmiinLogoProps) {
  const theme = useTheme();
  const mode = theme.palette.mode;
  // return mode === 'dark' ? (
  //   //@ts-ignore
  //   <LightLogo width={'155px'} height={'51px'} />
  // ) : (
  //   /*@ts-ignore*/
  //   <DarkLogo width={'155px'} height={'51px'} />
  // );
  return mode === 'dark' ? (
    /*@ts-ignore*/
    <ColorLogoWhite width={'155px'} height={'51px'} />
  ) : (
    /*@ts-ignore*/
    <ColorLogoDark width={'155px'} height={'51px'} />
  );
}

export default AdmiinLogo;
