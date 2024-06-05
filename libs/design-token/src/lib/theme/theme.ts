import { colors } from './colors';
import { muiTheme } from './muiTheme';
export const theme: any = {
  palette: {
    ...colors,
    mode: 'light',
    text: {
      primary: '#08160f',
    },
    background: {
      default: '#f1f1f1',
      paper: '#fff',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  ...muiTheme,
};
