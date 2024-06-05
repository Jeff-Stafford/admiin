import { alpha, getContrastRatio } from '@mui/material';

export const colors = {
  primary: {
    light: '#a374ff',
    main: '#8c52ff',
    dark: '#6239b2',
    50: '#EDE7FF',
    100: '#C5B9FC',
    200: '#9E8CF4',
    300: '#775FEE',
    400: '#5031E8',
    500: '#3717CE',
    600: '#2911A1',
    700: '#1D0C75',
    800: '#100748',
    900: '#06021E',
  },
  secondary: {
    light: '#D5B8FA',
    main: '#CC9FFA',
    dark: '#AD64FC',
    50: '#F7E5FF',
    100: '#DFB7FD',
    200: '#C488F8',
    300: '#A658F3',
    400: '#9A2AEF',
    500: '#8D11D5',
    600: '#790CA7',
    700: '#5E0778',
    800: '#3D0349',
    900: '#1b001d',
  },
  dark: {
    main: '#000000',
  },
  light: {
    light: alpha('#FFF', 0.5),
    dark: alpha('#FFF', 0.9),
    contrastText: getContrastRatio('#FFF', '#fff') > 4.5 ? '#fff' : '#111',
    main: '#FFF',
  },
};
