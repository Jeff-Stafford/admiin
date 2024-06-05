import { colors } from './colors';
import { muiTheme } from './muiTheme';

export const darkTheme: any = {
  palette: {
    mode: 'dark',
    ...colors,
    text: {
      primary: '#FFF',
    },
    background: {
      default: '#2B2B2B',
      paper: '#2B2B2B',
    },
  },
  ...muiTheme,
};
