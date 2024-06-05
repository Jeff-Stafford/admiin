import { ThemeOptions } from '@mui/material';

export const muiTheme: ThemeOptions = {
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          //textTransform: "uppercase",
          fontWeight: 600,
        },
        outlined: {
          border: '2px solid', // Setting the border to 2px for outlined variant
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontWeight: 400,
          border: '1px solid',
          borderWidth: 1,
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          marginRight: '8px',
          marginBottom: '8px',
        },
      },
    },
  },
};
