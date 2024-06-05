import deepmerge from 'deepmerge';
import React, { ReactNode, useMemo } from 'react';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { createEmotionCache, defaultTheme, getTheme } from '../../../utils';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, ThemeOptions, useMediaQuery } from '@mui/material';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesignSystemContextProvider } from '../DesignSystemContextProvider/DesignSystemContextProvider';
//import "./global.css";

const defaultCache = createEmotionCache();

type DesignSystemProviderProps = {
  cssCache?: EmotionCache;
  theme?: ThemeOptions;
  darkTheme?: ThemeOptions;
  mode?: 'light' | 'dark' | undefined;
  disableDark?: boolean;
  children?: ReactNode;
};

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    light: Palette['primary'];
  }
  interface PaletteOptions {
    light?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    light: true;
  }
}

export const DesignSystemProvider = ({
  children,
  cssCache,
  theme,
  darkTheme,
  disableDark = false,
}: DesignSystemProviderProps) => {
  const prefersDarkMode =
    useMediaQuery('(prefers-color-scheme: dark)') && !disableDark;
  const mergedTheme = useMemo(() => {
    const mode = prefersDarkMode ? 'dark' : 'light';
    const colouredTheme = darkTheme && prefersDarkMode ? darkTheme : theme;
    return colouredTheme
      ? getTheme(deepmerge(defaultTheme(mode), colouredTheme))
      : getTheme(defaultTheme(mode));
  }, [prefersDarkMode, darkTheme, theme]);

  return (
    <CacheProvider value={cssCache ?? defaultCache}>
      <EmotionThemeProvider theme={mergedTheme}>
        <ThemeProvider theme={mergedTheme}>
          <CssBaseline />
          <DesignSystemContextProvider theme={mergedTheme}>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              {children}
            </LocalizationProvider>
          </DesignSystemContextProvider>
        </ThemeProvider>
      </EmotionThemeProvider>
    </CacheProvider>
  );
};
