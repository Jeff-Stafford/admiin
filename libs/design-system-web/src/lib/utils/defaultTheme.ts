import { PaletteMode, ThemeOptions } from '@mui/material';
// import fontfaces from '../../assets/fonts/nexa/stylesheet.module.css';

export const defaultTheme = (mode: PaletteMode): ThemeOptions => ({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // '@global': {
        //   // Place @import at the beginning
        //   '@import': "url('https://fonts.cdnfonts.com/css/nexa-bold')",

        //   // Now add your other global styles
        html: {
          height: '100vh',
        },
        body: {
          height: '100vh',
        },
        '#root': {
          height: '100vh',
          // },
        },
      },
    },
  },
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            dark: '#7042cc',
            main: '#8c52ff',
            light: '#a374ff',
            contrastText: '#FFFFFF',
          },
          secondary: {
            dark: '#000000',
            main: '#1A1919',
            light: '#2F2E2E',
            contrastText: '#FFFFFF',
          },
          error: {
            main: '#FF4061',
            contrastText: '#FFFFFF',
          },
          warning: {
            main: '#ffca74',
            contrastText: '#FFFFFF',
          },
          info: {
            main: '#4DD0E1',
            contrastText: '#FFFFFF',
          },
          success: {
            main: '#96f775',
            contrastText: '#FFFFFF',
          },
          text: {
            primary: '#000000',
            secondary: '#000',
          },
          action: {
            disabled: '#6f6f6f',
            disabledBackground: '#bcbcbc',
            // hover: "#2f2e2e"
          },
          background: {
            default: '#f5f5f5',
            paper: '#f1f1f1',
          },
        }
      : {
          primary: {
            dark: '#a27827',
            main: '#CA993B',
            light: '#e8b34e',
            contrastText: '#FFFFFF',
          },
          secondary: {
            dark: '#000000',
            main: '#1a1919',
            light: '#2f2e2e',
            contrastText: '#FFFFFF',
          },
          error: {
            main: '#FF4061',
            contrastText: '#FFFFFF',
          },
          warning: {
            main: '#ffca74',
            contrastText: '#FFFFFF',
          },
          info: {
            main: '#4DD0E1',
            contrastText: '#FFFFFF',
          },
          success: {
            main: '#96f775',
            contrastText: '#FFFFFF',
          },
          text: {
            primary: '#999',
            secondary: '#999',
          },
          action: {
            disabled: '#6f6f6f',
            disabledBackground: '#bcbcbc',
            //hover: "#2f2e2e"
          },
          background: {
            default: '#2B2B2B',
            paper: '#2B2B2B',
          },
        }),
  },
  shape: { borderRadius: 8 },
  spacing: 8,
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Nexa", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    fontSize: 16,
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    fontWeightLight: 300,
    h1: {
      fontSize: '3rem',
      lineHeight: 1.25,
      fontWeight: 700,
      marginBottom: 8,
    },
    h2: {
      fontSize: '2.2rem',
      lineHeight: 1.4,
      fontWeight: 700,
      marginBottom: 8,
    },
    h3: {
      fontSize: '1.6rem',
      lineHeight: 1.33,
      fontWeight: 700,
      marginBottom: 8,
    },
    h4: {
      fontSize: '1.25rem',
      lineHeight: 1.65,
      fontWeight: 900,
      marginBottom: 8,
    },
    h5: {
      fontSize: '1.1rem',
      lineHeight: 1.5,
      fontWeight: 700,
      marginBottom: 8,
    },
    h6: {
      fontSize: '1rem',
      lineHeight: 2.8,
      fontWeight: 900,
      marginBottom: 8,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      fontWeight: 400,
    },
    button: {
      fontSize: '1rem',
      fontWeight: 700,
      lineHeight: 1.73,
      textTransform: 'none',
    },
  },
});
