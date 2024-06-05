import { ThemeOptions, ThemeProvider } from '@mui/material';
import { deepmerge } from 'deepmerge-ts';
import { darkTheme } from '@admiin-com/ds-design-token';
import { LinkBehavior } from '../LinkBehavior/LinkBehavior';
import { defaultTheme, getTheme } from '@admiin-com/ds-web';

interface DarkThemeProviderProps {
  children: React.ReactNode;
}
export const DarkThemeProvider = ({ children }: DarkThemeProviderProps) => {
  // Clone the main theme but set its mode to dark

  const commonTheme = {
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        },
      },
    },
  };

  const appDarkTheme: ThemeOptions = deepmerge(darkTheme, commonTheme);

  const theme = getTheme(deepmerge(defaultTheme('dark'), appDarkTheme));
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
