import { createTheme, useTheme } from '@mui/material';

export const useDarkTheme = () => {
  const theme = useTheme();
  // Clone the main theme but set its mode to dark
  const darkTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: 'dark',
    },
  });

  return darkTheme;
};
